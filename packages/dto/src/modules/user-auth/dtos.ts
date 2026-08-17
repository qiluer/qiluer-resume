import { createZodDto } from 'nestjs-zod/dto';
import {
  forgotPasswordUserAuthSchema,
  loginUserAuthSchema,
  registerUserAuthSchema,
  resetPasswordCallbackUserAuthParamsSchema,
  resetPasswordUserAuthSchema,
  sendVerificationEmailUserAuthSchema,
  verifyEmailUserAuthQuerySchema,
} from './schemas';

/** 普通用户注册 DTO。 */
export class RegisterUserAuthDto extends createZodDto(registerUserAuthSchema) {}

/** 普通用户登录 DTO。 */
export class LoginUserAuthDto extends createZodDto(loginUserAuthSchema) {}

/** 重新发送验证邮件 DTO。 */
export class SendVerificationEmailUserAuthDto extends createZodDto(sendVerificationEmailUserAuthSchema) {}

/** 邮箱验证业务回调查询 DTO。 */
export class VerifyEmailUserAuthQueryDto extends createZodDto(verifyEmailUserAuthQuerySchema) {}

/** 忘记密码 DTO。 */
export class ForgotPasswordUserAuthDto extends createZodDto(forgotPasswordUserAuthSchema) {}

/** 密码重置业务回调路径参数 DTO。 */
export class ResetPasswordCallbackUserAuthParamsDto extends createZodDto(resetPasswordCallbackUserAuthParamsSchema) {}

/** 设置新密码 DTO。 */
export class ResetPasswordUserAuthDto extends createZodDto(resetPasswordUserAuthSchema) {}
