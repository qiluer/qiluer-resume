import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as NestBetterAuthModule } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import { EmailModule } from '@/shared/email/email.module';
import { EmailService } from '@/shared/email/email.service';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { createUserAuth } from './user-auth.factory';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { RedisService } from '@/shared/redis';

const logger = new Logger('UserAuthModule');

/** 从根环境配置中读取必填字符串。 */
function requiredConfig(configService: ConfigService, key: string): string {
  const value = configService.get<string>(key)?.trim();
  if (!value) throw new Error(`${key} is not defined in the root .env file`);
  return value;
}

/** 对所有 Better Auth 原生 HTTP 路由返回 404，仅允许业务 Controller 对外提供认证能力。 */
function blockNativeAuthRoutes(_request: Request, response: Response): void {
  response.status(404).end();
}

/** 普通用户 Better Auth 认证模块，为未来 AdminAuthModule 保留独立边界。 */
@Module({
  imports: [
    NestBetterAuthModule.forRootAsync({
      disableGlobalAuthGuard: true,
      imports: [ConfigModule, PrismaModule, EmailModule],
      inject: [PrismaService, EmailService, ConfigService, RedisService],
      useFactory: (prisma: PrismaService, emailService: EmailService, configService: ConfigService, redisService: RedisService) => {
        const secret = requiredConfig(configService, 'BETTER_AUTH_SECRET');
        if (secret.length < 32) throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters');

        const trustedOrigins = requiredConfig(configService, 'BETTER_AUTH_TRUSTED_ORIGINS')
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean);
        const redisClient = redisService.getClient();

        return {
          auth: createUserAuth({
            prisma,
            redisClient,
            secret,
            baseURL: requiredConfig(configService, 'BETTER_AUTH_URL'),
            trustedOrigins,
            isProduction: configService.get<string>('NODE_ENV') === 'production',
            sendEmail: (email) => emailService.sendMail(email),
            onEmailError: (error) => logger.error('Better Auth email delivery failed', error instanceof Error ? error.stack : String(error)),
          }),
          bodyParser: {
            json: { limit: '2mb' },
            urlencoded: { limit: '2mb', extended: true },
          },
          middleware: blockNativeAuthRoutes,
        };
      },
    }),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService],
  exports: [UserAuthService],
})
export class UserAuthModule {}
