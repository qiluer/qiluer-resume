import { Global, Module } from '@nestjs/common';
import { RedisService } from '@/shared/redis/redis.service';

/**
 * Redis 模块
 * - 标记为 @Global()，全应用可直接注入 RedisService，无需在每个业务模块中重复 imports
 * - 形态与 PrismaModule / EmailModule 保持一致
 */
@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
