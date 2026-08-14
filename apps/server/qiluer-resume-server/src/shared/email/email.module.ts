import { Global, Module } from '@nestjs/common';
import { EmailService } from '@/shared/email/email.service';

/**
 * 邮件模块
 * - 标记为 @Global()，全应用可直接注入 EmailService，无需在每个业务模块中重复 imports
 * - 形态与 PrismaModule 保持一致
 */
@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
