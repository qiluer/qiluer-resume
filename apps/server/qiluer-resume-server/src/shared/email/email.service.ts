import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { ErrorCodeEnum } from '@qiluer-resume/dto';
import { BusinessException } from '@/common/errors/business.exception';

/**
 * 邮件发送参数
 * - 仅在服务端内部方法之间传递，不作为 Controller 入参，因此使用 TS interface 而非 zod schema
 */
export interface SendMailOptions {
  /** 收件人；支持单收件人或群发 */
  to: string | string[];
  /** 邮件主题 */
  subject: string;
  /** 邮件正文（HTML） */
  html: string;
}

/**
 * 邮件服务
 * - 通过 nodemailer 发送邮件，所有配置从 ConfigService（.env）读取
 * - 启动期调用 transporter.verify() 探测 SMTP 连通性；失败仅记录日志，不阻塞应用启动
 * - 发送失败统一包装为 BusinessException(ErrorCodeEnum.第三方服务异常)，与项目异常链路对齐
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly defaultFromName: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('nodemailer_host');
    const port = this.configService.get<number>('nodemailer_port');
    const user = this.configService.get<string>('nodemailer_auth_user');
    const pass = this.configService.get<string>('nodemailer_auth_pass');

    if (!host || !port || !user || !pass) {
      throw new Error(
        'EmailService: nodemailer 配置缺失，请检查 .env 中的 nodemailer_host / nodemailer_port / nodemailer_auth_user / nodemailer_auth_pass',
      );
    }

    this.defaultFromName = this.configService.get<string>('nodemailer_from_name') ?? '柒陆贰助手';

    this.transporter = createTransport({
      host,
      port,
      secure: true,
      auth: { user, pass },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Email transporter verified successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // 邮件属于辅助能力，校验失败不阻塞应用启动，由调用方在首次发送时再发现真实错误
      this.logger.error(`❌ Email transporter verify failed: ${message}`);
    }
  }

  /**
   * 发送邮件
   * @param options 收件人、主题、正文
   */
  async sendMail({ to, subject, html }: SendMailOptions): Promise<void> {
    const fromUser = this.configService.get<string>('nodemailer_auth_user');
    try {
      await this.transporter.sendMail({
        from: {
          name: this.defaultFromName,
          address: fromUser!,
        },
        to,
        subject,
        html,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Email send failed: to=${JSON.stringify(to)}, subject=${subject}, error=${message}`);
      throw new BusinessException(ErrorCodeEnum.第三方服务异常, `邮件发送失败：${message}`);
    }
  }
}
