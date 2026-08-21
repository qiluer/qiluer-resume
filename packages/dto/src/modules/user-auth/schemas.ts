import { z } from 'zod';
import { createRespondDataSchema } from '../respond/schemas';

/** Better Auth 邮箱密码认证所使用的密码规则。 */
export const userAuthPasswordSchema = z.string().min(8, '密码至少需要 8 位').max(128, '密码最多允许 128 位').meta({ description: '用户密码' });

/** 普通用户注册请求。 */
export const registerUserAuthSchema = z.object({
  email: z.email('邮箱格式不正确').meta({ description: '用户邮箱' }),
  password: userAuthPasswordSchema,
});

/** 普通用户邮箱密码登录请求。 */
export const loginUserAuthSchema = z.object({
  email: z.email('邮箱格式不正确').meta({ description: '用户邮箱' }),
  password: userAuthPasswordSchema,
});

/** 重新发送验证邮件请求。 */
export const sendVerificationEmailUserAuthSchema = z.object({
  email: z.email('邮箱格式不正确').meta({ description: '用户邮箱' }),
});

/** 验证邮箱业务回调查询参数。 */
export const verifyEmailUserAuthQuerySchema = z.object({
  token: z.string().min(1, '验证令牌不能为空').meta({ description: '邮箱验证令牌' }),
});

/** 忘记密码邮件请求。 */
export const forgotPasswordUserAuthSchema = z.object({
  email: z.email('邮箱格式不正确').meta({ description: '用户邮箱' }),
});

/** 密码重置业务回调路径参数。 */
export const resetPasswordCallbackUserAuthParamsSchema = z.object({
  token: z.string().min(1, '重置令牌不能为空').meta({ description: '密码重置令牌' }),
});

/** 使用邮件令牌设置新密码的请求。 */
export const resetPasswordUserAuthSchema = z.object({
  token: z.string().min(1, '重置令牌不能为空').meta({ description: '密码重置令牌' }),
  newPassword: userAuthPasswordSchema,
});

/** 对外公开的普通用户信息，不包含认证令牌。 */
export const userAuthUserSchema = z.object({
  id: z.string().meta({ description: '用户 ID' }),
  name: z.string().meta({ description: '用户姓名' }),
  email: z.email().meta({ description: '用户邮箱' }),
  image: z.string().meta({ description: '用户头像' }),
});

/** 对外公开的脱敏 Session 信息，不包含 Session token。 */
export const userAuthSessionSchema = z.object({
  id: z.string().meta({ description: 'Session ID' }),
  userId: z.string().meta({ description: '用户 ID' }),
  ipAddress: z.string().meta({ description: '用户 IP 地址' }),
  userAgent: z.string().meta({ description: '用户 User Agent' }),
});

/** 注册接口统一响应。 */
export const registerUserAuthResponseSchema = createRespondDataSchema(userAuthUserSchema);

/** 登录接口统一响应。 */
export const loginUserAuthResponseSchema = createRespondDataSchema(userAuthUserSchema);

/** Session 查询接口统一响应，游客的 data 为 null。 */
export const sessionUserAuthResponseSchema = createRespondDataSchema(
  z
    .object({
      user: userAuthUserSchema,
      session: userAuthSessionSchema,
    })
    .nullable(),
);

/** 通用认证操作结果。 */
export const userAuthActionSchema = z.object({
  success: z.boolean(),
});

/** 无数据认证操作的统一响应。 */
export const userAuthActionResponseSchema = createRespondDataSchema(userAuthActionSchema);

/** 普通用户注册输入类型。 */
export type RegisterUserAuthType = z.infer<typeof registerUserAuthSchema>;
/** 普通用户登录输入类型。 */
export type LoginUserAuthType = z.infer<typeof loginUserAuthSchema>;
/** 重新发送验证邮件输入类型。 */
export type SendVerificationEmailUserAuthType = z.infer<typeof sendVerificationEmailUserAuthSchema>;
/** 邮箱验证回调查询参数类型。 */
export type VerifyEmailUserAuthQueryType = z.infer<typeof verifyEmailUserAuthQuerySchema>;
/** 忘记密码输入类型。 */
export type ForgotPasswordUserAuthType = z.infer<typeof forgotPasswordUserAuthSchema>;
/** 密码重置回调路径参数类型。 */
export type ResetPasswordCallbackUserAuthParamsType = z.infer<typeof resetPasswordCallbackUserAuthParamsSchema>;
/** 设置新密码输入类型。 */
export type ResetPasswordUserAuthType = z.infer<typeof resetPasswordUserAuthSchema>;

/** 对外公开的普通用户类型。 */
export type UserAuthUserType = z.infer<typeof userAuthUserSchema>;
/** 对外公开的脱敏 Session 类型。 */
export type UserAuthSessionType = z.infer<typeof userAuthSessionSchema>;
/** 通用认证操作结果类型。 */
export type UserAuthActionType = z.infer<typeof userAuthActionSchema>;
