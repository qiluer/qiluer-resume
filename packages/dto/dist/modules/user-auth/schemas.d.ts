import { z } from 'zod';
/** Better Auth 邮箱密码认证所使用的密码规则。 */
export declare const userAuthPasswordSchema: z.ZodString;
/** 由受信任前端传入的绝对回调地址。 */
export declare const userAuthCallbackUrlSchema: z.ZodURL;
/** 普通用户注册请求。 */
export declare const registerUserAuthSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    callbackURL: z.ZodURL;
}, z.core.$strip>;
/** 普通用户邮箱密码登录请求。 */
export declare const loginUserAuthSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
    callbackURL: z.ZodURL;
}, z.core.$strip>;
/** 重新发送验证邮件请求。 */
export declare const sendVerificationEmailUserAuthSchema: z.ZodObject<{
    email: z.ZodEmail;
    callbackURL: z.ZodURL;
}, z.core.$strip>;
/** 验证邮箱业务回调查询参数。 */
export declare const verifyEmailUserAuthQuerySchema: z.ZodObject<{
    token: z.ZodString;
    callbackURL: z.ZodURL;
}, z.core.$strip>;
/** 忘记密码邮件请求。 */
export declare const forgotPasswordUserAuthSchema: z.ZodObject<{
    email: z.ZodEmail;
    redirectTo: z.ZodURL;
}, z.core.$strip>;
/** 密码重置业务回调路径参数。 */
export declare const resetPasswordCallbackUserAuthParamsSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
/** 密码重置业务回调查询参数。 */
export declare const resetPasswordCallbackUserAuthQuerySchema: z.ZodObject<{
    callbackURL: z.ZodURL;
}, z.core.$strip>;
/** 使用邮件令牌设置新密码的请求。 */
export declare const resetPasswordUserAuthSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
/** 对外公开的普通用户信息，不包含认证令牌。 */
export declare const userAuthUserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodEmail;
    emailVerified: z.ZodBoolean;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodISODateTime;
    updatedAt: z.ZodISODateTime;
}, z.core.$strip>;
/** 对外公开的脱敏 Session 信息，不包含 Session token。 */
export declare const userAuthSessionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    expiresAt: z.ZodISODateTime;
    createdAt: z.ZodISODateTime;
    updatedAt: z.ZodISODateTime;
    ipAddress: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userAgent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** 注册接口统一响应。 */
export declare const registerUserAuthResponseSchema: z.ZodObject<{
    code: z.ZodLiteral<200>;
    message: z.ZodLiteral<"success">;
    data: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodEmail;
        emailVerified: z.ZodBoolean;
        image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodISODateTime;
        updatedAt: z.ZodISODateTime;
    }, z.core.$strip>;
}, z.core.$strip>;
/** 登录接口统一响应。 */
export declare const loginUserAuthResponseSchema: z.ZodObject<{
    code: z.ZodLiteral<200>;
    message: z.ZodLiteral<"success">;
    data: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodEmail;
        emailVerified: z.ZodBoolean;
        image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodISODateTime;
        updatedAt: z.ZodISODateTime;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Session 查询接口统一响应，游客的 data 为 null。 */
export declare const sessionUserAuthResponseSchema: z.ZodObject<{
    code: z.ZodLiteral<200>;
    message: z.ZodLiteral<"success">;
    data: z.ZodNullable<z.ZodObject<{
        user: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            email: z.ZodEmail;
            emailVerified: z.ZodBoolean;
            image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            createdAt: z.ZodISODateTime;
            updatedAt: z.ZodISODateTime;
        }, z.core.$strip>;
        session: z.ZodObject<{
            id: z.ZodString;
            userId: z.ZodString;
            expiresAt: z.ZodISODateTime;
            createdAt: z.ZodISODateTime;
            updatedAt: z.ZodISODateTime;
            ipAddress: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            userAgent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** 通用认证操作结果。 */
export declare const userAuthActionSchema: z.ZodObject<{
    success: z.ZodBoolean;
}, z.core.$strip>;
/** 无数据认证操作的统一响应。 */
export declare const userAuthActionResponseSchema: z.ZodObject<{
    code: z.ZodLiteral<200>;
    message: z.ZodLiteral<"success">;
    data: z.ZodObject<{
        success: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
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
/** 密码重置回调查询参数类型。 */
export type ResetPasswordCallbackUserAuthQueryType = z.infer<typeof resetPasswordCallbackUserAuthQuerySchema>;
/** 设置新密码输入类型。 */
export type ResetPasswordUserAuthType = z.infer<typeof resetPasswordUserAuthSchema>;
/** 对外公开的普通用户类型。 */
export type UserAuthUserType = z.infer<typeof userAuthUserSchema>;
/** 对外公开的脱敏 Session 类型。 */
export type UserAuthSessionType = z.infer<typeof userAuthSessionSchema>;
/** 通用认证操作结果类型。 */
export type UserAuthActionType = z.infer<typeof userAuthActionSchema>;
//# sourceMappingURL=schemas.d.ts.map