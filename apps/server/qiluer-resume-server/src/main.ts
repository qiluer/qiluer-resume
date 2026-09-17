import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module.js';
import { DocumentBuilder, SwaggerModule, type SwaggerDocumentOptions } from '@nestjs/swagger';
import { createSchema } from 'zod-openapi';

function isZodSchema(schema: unknown): boolean {
  return !!schema && typeof schema === 'object' && (schema as { '~standard'?: { vendor?: string } })['~standard']?.vendor === 'zod';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  /** 启用优雅关闭钩子，确保 Redis 等服务连接在应用关闭时被释放，避免资源泄漏 */
  app.enableShutdownHooks();

  const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? 'http://localhost:8080').split(',').map((origin) => origin.trim());
  app.enableCors({ origin: trustedOrigins, credentials: true });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Qiluer Resume API')
    .setDescription('The Qiluer Resume API description')
    .setVersion('1.0')
    .addCookieAuth('better-auth.session_token', undefined, 'user-session')
    .build();

  const documentOptions: SwaggerDocumentOptions = {
    standardSchemaConverter: (schema, { schemaType }) => {
      if (!isZodSchema(schema)) return undefined;

      const converted = createSchema(schema as never, {
        io: schemaType,
        openapiVersion: '3.0.0',
      });

      return { schema: converted.schema, components: converted.components };
    },
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
