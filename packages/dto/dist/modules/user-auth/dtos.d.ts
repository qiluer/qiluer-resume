declare const RegisterUserAuthDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodString;
    email: import("zod").ZodEmail;
    password: import("zod").ZodString;
    callbackURL: import("zod").ZodURL;
}, import("zod/v4/core").$strip>, false>;
/** 普通用户注册 DTO。 */
export declare class RegisterUserAuthDto extends RegisterUserAuthDto_base {
}
declare const LoginUserAuthDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodEmail;
    password: import("zod").ZodString;
    rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
    callbackURL: import("zod").ZodURL;
}, import("zod/v4/core").$strip>, false>;
/** 普通用户登录 DTO。 */
export declare class LoginUserAuthDto extends LoginUserAuthDto_base {
}
declare const SendVerificationEmailUserAuthDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodEmail;
    callbackURL: import("zod").ZodURL;
}, import("zod/v4/core").$strip>, false>;
/** 重新发送验证邮件 DTO。 */
export declare class SendVerificationEmailUserAuthDto extends SendVerificationEmailUserAuthDto_base {
}
declare const VerifyEmailUserAuthQueryDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    token: import("zod").ZodString;
    callbackURL: import("zod").ZodURL;
}, import("zod/v4/core").$strip>, false>;
/** 邮箱验证业务回调查询 DTO。 */
export declare class VerifyEmailUserAuthQueryDto extends VerifyEmailUserAuthQueryDto_base {
}
declare const ForgotPasswordUserAuthDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodEmail;
    redirectTo: import("zod").ZodURL;
}, import("zod/v4/core").$strip>, false>;
/** 忘记密码 DTO。 */
export declare class ForgotPasswordUserAuthDto extends ForgotPasswordUserAuthDto_base {
}
declare const ResetPasswordCallbackUserAuthParamsDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    token: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
/** 密码重置业务回调路径参数 DTO。 */
export declare class ResetPasswordCallbackUserAuthParamsDto extends ResetPasswordCallbackUserAuthParamsDto_base {
}
declare const ResetPasswordCallbackUserAuthQueryDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    callbackURL: import("zod").ZodURL;
}, import("zod/v4/core").$strip>, false>;
/** 密码重置业务回调查询 DTO。 */
export declare class ResetPasswordCallbackUserAuthQueryDto extends ResetPasswordCallbackUserAuthQueryDto_base {
}
declare const ResetPasswordUserAuthDto_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    token: import("zod").ZodString;
    newPassword: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
/** 设置新密码 DTO。 */
export declare class ResetPasswordUserAuthDto extends ResetPasswordUserAuthDto_base {
}
export {};
//# sourceMappingURL=dtos.d.ts.map