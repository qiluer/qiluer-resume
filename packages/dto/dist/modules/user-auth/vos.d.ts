declare const UserAuthUserVO_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    name: import("zod").ZodString;
    email: import("zod").ZodEmail;
    emailVerified: import("zod").ZodBoolean;
    image: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    createdAt: import("zod").ZodISODateTime;
    updatedAt: import("zod").ZodISODateTime;
}, import("zod/v4/core").$strip>, false>;
/** 对外公开的普通用户 VO。 */
export declare class UserAuthUserVO extends UserAuthUserVO_base {
}
declare const UserAuthSessionVO_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    userId: import("zod").ZodString;
    expiresAt: import("zod").ZodISODateTime;
    createdAt: import("zod").ZodISODateTime;
    updatedAt: import("zod").ZodISODateTime;
    ipAddress: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    userAgent: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
/** 不包含 Session token 的 Session VO。 */
export declare class UserAuthSessionVO extends UserAuthSessionVO_base {
}
declare const RegisterUserAuthVO_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    code: import("zod").ZodLiteral<200>;
    message: import("zod").ZodLiteral<"success">;
    data: import("zod").ZodObject<{
        id: import("zod").ZodString;
        name: import("zod").ZodString;
        email: import("zod").ZodEmail;
        emailVerified: import("zod").ZodBoolean;
        image: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
        createdAt: import("zod").ZodISODateTime;
        updatedAt: import("zod").ZodISODateTime;
    }, import("zod/v4/core").$strip>;
}, import("zod/v4/core").$strip>, false>;
/** 注册接口统一响应 VO。 */
export declare class RegisterUserAuthVO extends RegisterUserAuthVO_base {
}
declare const LoginUserAuthVO_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    code: import("zod").ZodLiteral<200>;
    message: import("zod").ZodLiteral<"success">;
    data: import("zod").ZodObject<{
        id: import("zod").ZodString;
        name: import("zod").ZodString;
        email: import("zod").ZodEmail;
        emailVerified: import("zod").ZodBoolean;
        image: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
        createdAt: import("zod").ZodISODateTime;
        updatedAt: import("zod").ZodISODateTime;
    }, import("zod/v4/core").$strip>;
}, import("zod/v4/core").$strip>, false>;
/** 登录接口统一响应 VO。 */
export declare class LoginUserAuthVO extends LoginUserAuthVO_base {
}
declare const SessionUserAuthVO_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    code: import("zod").ZodLiteral<200>;
    message: import("zod").ZodLiteral<"success">;
    data: import("zod").ZodNullable<import("zod").ZodObject<{
        user: import("zod").ZodObject<{
            id: import("zod").ZodString;
            name: import("zod").ZodString;
            email: import("zod").ZodEmail;
            emailVerified: import("zod").ZodBoolean;
            image: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
            createdAt: import("zod").ZodISODateTime;
            updatedAt: import("zod").ZodISODateTime;
        }, import("zod/v4/core").$strip>;
        session: import("zod").ZodObject<{
            id: import("zod").ZodString;
            userId: import("zod").ZodString;
            expiresAt: import("zod").ZodISODateTime;
            createdAt: import("zod").ZodISODateTime;
            updatedAt: import("zod").ZodISODateTime;
            ipAddress: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
            userAgent: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
        }, import("zod/v4/core").$strip>;
    }, import("zod/v4/core").$strip>>;
}, import("zod/v4/core").$strip>, false>;
/** Session 查询接口统一响应 VO。 */
export declare class SessionUserAuthVO extends SessionUserAuthVO_base {
}
declare const UserAuthActionDataVO_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    success: import("zod").ZodBoolean;
}, import("zod/v4/core").$strip>, false>;
/** 通用认证操作数据 VO。 */
export declare class UserAuthActionDataVO extends UserAuthActionDataVO_base {
}
declare const UserAuthActionVO_base: import("nestjs-zod/dto").ZodDto<import("zod").ZodObject<{
    code: import("zod").ZodLiteral<200>;
    message: import("zod").ZodLiteral<"success">;
    data: import("zod").ZodObject<{
        success: import("zod").ZodBoolean;
    }, import("zod/v4/core").$strip>;
}, import("zod/v4/core").$strip>, false>;
/** 通用认证操作统一响应 VO。 */
export declare class UserAuthActionVO extends UserAuthActionVO_base {
}
export {};
//# sourceMappingURL=vos.d.ts.map