import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import * as path from 'path';
import { AppController } from '@/app.controller.js';
import { AppService } from '@/app.service.js';
import { AllExceptionFilter } from '@/common/filters/all-exception.filter.js';
import { FormatResponseInterceptor } from '@/common/interceptors/format-response.interceptor.js';
import { PrismaModule } from '@/shared/prisma/prisma.module.js';
import { EmailModule } from '@/shared/email/email.module.js';
import { RedisModule } from '@/shared/redis/redis.module.js';
import { UserAuthModule } from '@/modules/user-auth/user-auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : path.resolve(process.cwd(), '../../../.env'),
    }),
    PrismaModule,
    RedisModule,
    EmailModule,
    UserAuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: StandardSchemaValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
