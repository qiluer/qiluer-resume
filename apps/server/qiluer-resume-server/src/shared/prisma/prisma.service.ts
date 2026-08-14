import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, getPrismaClientOptions } from '@qiluer-resume/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    super(getPrismaClientOptions(connectionString));
  }
  async onModuleInit() {
    try {
      await this.$connect();
      // 测试数据库连接
      await this.$queryRaw`SELECT 1`;
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
