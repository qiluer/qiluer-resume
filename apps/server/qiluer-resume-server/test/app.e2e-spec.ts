import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { EmailService, SendMailOptions } from '@/shared/email/email.service';
import { RedisService } from '@/shared/redis/redis.service';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

@Controller('protected-test')
@UseGuards(AuthGuard)
class ProtectedTestController {
  @Get()
  getProtected(): string {
    return 'protected';
  }
}

describe('User authentication (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let openApiDocument: OpenAPIObject;
  const sentEmails: SendMailOptions[] = [];
  const email = `better-auth-${Date.now()}@example.com`;
  const password = 'InitialPassword123!';
  const newPassword = 'UpdatedPassword123!';
  const webOrigin = 'http://localhost:8080';
  const userAuthCallbackURL = `${webOrigin}/auth/callback`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule], controllers: [ProtectedTestController] })
      .overrideProvider(EmailService)
      .useValue({
        sendMail: (options: SendMailOptions) => {
          sentEmails.push(options);
          return Promise.resolve();
        },
      })
      .compile();

    app = moduleFixture.createNestApplication({ bodyParser: false });
    app.setGlobalPrefix('api');
    await app.init();
    prisma = app.get(PrismaService);
    openApiDocument = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Test').setVersion('1.0').addCookieAuth('better-auth.session_token', undefined, 'user-session').build(),
    );
  });

  afterAll(async () => {
    if (prisma) await prisma.user.deleteMany({ where: { email } });
    if (app) await app.close();
  });

  it('keeps the root endpoint anonymous', async () => {
    expect(app.get(RedisService)).toBeInstanceOf(RedisService);

    await request(app.getHttpServer())
      .get('/api/health-check')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ code: 0, message: 'success' });
        expect(body.data).toMatch(/^服务正常运行: \d{4}-\d{2}-\d{2}T/);
      });

    await request(app.getHttpServer()).get('/api/user-auth/session').expect(200).expect({ code: 0, message: 'success', data: null });

    await request(app.getHttpServer())
      .get('/api/protected-test')
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBe('Unauthorized');
        expect(body.data).toEqual({});
      });

    await request(app.getHttpServer()).get('/api/auth/ok').expect(404);
    expect(openApiDocument.paths['/api/user-auth/register']).toBeDefined();
    expect(openApiDocument.paths['/api/user-auth/login']).toBeDefined();
    expect(openApiDocument.paths['/api/user-auth/session']).toBeDefined();
    expect(Object.keys(openApiDocument.paths).some((path) => path.startsWith('/api/auth'))).toBe(false);
  });

  it('protects account discovery and uses fixed callback URLs for invalid tokens', async () => {
    const unknownEmail = `unknown-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/api/user-auth/send-verification-email')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.20')
      .send({ email: unknownEmail })
      .expect(200)
      .expect({ code: 0, message: 'success', data: { success: true } });

    await request(app.getHttpServer())
      .post('/api/user-auth/forgot-password')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.21')
      .send({ email: unknownEmail })
      .expect(200)
      .expect({ code: 0, message: 'success', data: { success: true } });

    await request(app.getHttpServer())
      .post('/api/user-auth/send-verification-email')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.22')
      .send({ email: unknownEmail, callbackURL: 'https://untrusted.example.com/verify-email' })
      .expect(200)
      .expect({ code: 0, message: 'success', data: { success: true } });

    const invalidVerification = await request(app.getHttpServer())
      .get('/api/user-auth/verify-email')
      .query({ token: 'invalid-verification-token', callbackURL: 'https://untrusted.example.com/verify-email' })
      .expect(302);
    const invalidVerificationLocation = new URL(invalidVerification.headers.location);
    expect(`${invalidVerificationLocation.origin}${invalidVerificationLocation.pathname}`).toBe(userAuthCallbackURL);
    expect(invalidVerificationLocation.searchParams.get('flow')).toBe('verify-email');
    expect(invalidVerificationLocation.searchParams.get('error')).toBe('INVALID_TOKEN');

    const invalidReset = await request(app.getHttpServer()).get('/api/user-auth/reset-password/invalid-reset-token').expect(302);
    const invalidResetLocation = new URL(invalidReset.headers.location);
    expect(`${invalidResetLocation.origin}${invalidResetLocation.pathname}`).toBe(userAuthCallbackURL);
    expect(invalidResetLocation.searchParams.get('flow')).toBe('reset-password');
    expect(invalidResetLocation.searchParams.get('error')).toBe('INVALID_TOKEN');
  });

  it('registers, verifies, signs in, resets the password, and signs out', async () => {
    const agent = request.agent(app.getHttpServer());

    const signUpResponse = await agent
      .post('/api/user-auth/register')
      .set('Origin', webOrigin)
      .send({ name: 'Better Auth User', email, password, callbackURL: 'https://untrusted.example.com/verify-email' })
      .expect(200);

    expect(signUpResponse.body).toMatchObject({ code: 0, message: 'success', data: { email } });
    expect(signUpResponse.body).not.toHaveProperty('data.token');
    const verificationEmail = sentEmails.find((message) => message.subject.includes('验证'));
    expect(verificationEmail?.to).toBe(email);

    const duplicateSignUpResponse = await agent
      .post('/api/user-auth/register')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.9')
      .send({ name: 'Better Auth User', email, password })
      .expect(200);
    expect(duplicateSignUpResponse.body).toEqual({ code: 30003, message: '邮箱已被注册', data: {} });

    await agent
      .post('/api/user-auth/login')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.10')
      .send({ email, password })
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(30006);
      });

    const verificationUrl = verificationEmail?.html.match(/href="([^"]+)"/)?.[1].replaceAll('&amp;', '&');
    expect(verificationUrl).toBeDefined();
    const verificationRequestUrl = new URL(verificationUrl!);
    expect(verificationRequestUrl.pathname).toBe('/api/user-auth/verify-email');
    expect(verificationRequestUrl.searchParams.get('callbackURL')).toBe(`${userAuthCallbackURL}?flow=verify-email`);
    const verificationCallbackResponse = await agent.get(`${verificationRequestUrl.pathname}${verificationRequestUrl.search}`).expect(302);
    const verificationCallbackLocation = new URL(verificationCallbackResponse.headers.location);
    expect(`${verificationCallbackLocation.origin}${verificationCallbackLocation.pathname}`).toBe(userAuthCallbackURL);
    expect(verificationCallbackLocation.searchParams.get('flow')).toBe('verify-email');
    expect(verificationCallbackLocation.searchParams.has('error')).toBe(false);

    const signInResponse = await agent
      .post('/api/user-auth/login')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.11')
      .send({ email, password })
      .expect(200);
    expect(signInResponse.headers['set-cookie']).toBeDefined();
    expect(signInResponse.body).toMatchObject({ code: 0, message: 'success', data: { email } });
    expect(signInResponse.body).not.toHaveProperty('data.token');

    await agent
      .get('/api/user-auth/session')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.user.email).toBe(email);
        expect(body.data.session).not.toHaveProperty('token');
      });

    await agent.post('/api/user-auth/forgot-password').set('Origin', webOrigin).send({ email }).expect(200);

    const resetEmail = sentEmails.find((message) => message.subject.includes('重置'));
    const resetUrl = resetEmail?.html.match(/href="([^"]+)"/)?.[1].replaceAll('&amp;', '&');
    expect(resetUrl).toBeDefined();
    const resetCallbackUrl = new URL(resetUrl!);
    expect(resetCallbackUrl.pathname).toMatch(/^\/api\/user-auth\/reset-password\//);
    expect(resetCallbackUrl.searchParams.get('callbackURL')).toBe(`${userAuthCallbackURL}?flow=reset-password`);
    const resetCallbackResponse = await agent.get(`${resetCallbackUrl.pathname}${resetCallbackUrl.search}`).expect(302);
    const resetCallbackLocation = new URL(resetCallbackResponse.headers.location);
    expect(`${resetCallbackLocation.origin}${resetCallbackLocation.pathname}`).toBe(userAuthCallbackURL);
    expect(resetCallbackLocation.searchParams.get('flow')).toBe('reset-password');
    const resetToken = resetCallbackLocation.searchParams.get('token');
    expect(resetToken).toBeTruthy();

    await agent.post('/api/user-auth/reset-password').set('Origin', webOrigin).send({ newPassword, token: resetToken }).expect(200);

    await agent
      .get('/api/user-auth/session')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toBeNull();
      });

    await agent
      .post('/api/user-auth/login')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.13')
      .send({ email, password })
      .expect(200)
      .expect(({ body }) => {
        expect(body.code).toBe(30007);
      });

    await agent
      .post('/api/user-auth/login')
      .set('Origin', webOrigin)
      .set('X-Forwarded-For', '127.0.0.12')
      .send({ email, password: newPassword })
      .expect(200);

    const signOutResponse = await agent.post('/api/user-auth/logout').set('Origin', webOrigin).expect(200);
    expect(signOutResponse.headers['set-cookie']).toBeDefined();
    await agent
      .get('/api/user-auth/session')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toBeNull();
      });
  });
});
