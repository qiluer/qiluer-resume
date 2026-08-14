import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? 'http://localhost:8080').split(',').map((origin) => origin.trim());
  app.enableCors({ origin: trustedOrigins, credentials: true });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Qiluer Resume API')
    .setDescription('The Qiluer Resume API description')
    .setVersion('1.0')
    .addCookieAuth('better-auth.session_token', undefined, 'user-session')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, cleanupOpenApiDoc(document));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
