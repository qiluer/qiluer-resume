"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthActionResponseSchema = exports.userAuthActionSchema = exports.sessionUserAuthResponseSchema = exports.loginUserAuthResponseSchema = exports.registerUserAuthResponseSchema = exports.userAuthSessionSchema = exports.userAuthUserSchema = exports.resetPasswordUserAuthSchema = exports.resetPasswordCallbackUserAuthQuerySchema = exports.resetPasswordCallbackUserAuthParamsSchema = exports.forgotPasswordUserAuthSchema = exports.verifyEmailUserAuthQuerySchema = exports.sendVerificationEmailUserAuthSchema = exports.loginUserAuthSchema = exports.registerUserAuthSchema = exports.userAuthCallbackUrlSchema = exports.userAuthPasswordSchema = void 0;
const zod_1 = require("zod");
/** Better Auth 邮箱密码认证所使用的密码规则。 */
exports.userAuthPasswordSchema = zod_1.z.string().min(8, '密码至少需要 8 位').max(128, '密码最多允许 128 位');
/** 由受信任前端传入的绝对回调地址。 */
exports.userAuthCallbackUrlSchema = zod_1.z.url('回调地址必须是有效的绝对 URL');
/** 普通用户注册请求。 */
exports.registerUserAuthSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, '姓名不能为空'),
    email: zod_1.z.email('邮箱格式不正确'),
    password: exports.userAuthPasswordSchema,
    callbackURL: exports.userAuthCallbackUrlSchema,
});
/** 普通用户邮箱密码登录请求。 */
exports.loginUserAuthSchema = zod_1.z.object({
    email: zod_1.z.email('邮箱格式不正确'),
    password: exports.userAuthPasswordSchema,
    rememberMe: zod_1.z.boolean().optional(),
    callbackURL: exports.userAuthCallbackUrlSchema,
});
/** 重新发送验证邮件请求。 */
exports.sendVerificationEmailUserAuthSchema = zod_1.z.object({
    email: zod_1.z.email('邮箱格式不正确'),
    callbackURL: exports.userAuthCallbackUrlSchema,
});
/** 验证邮箱业务回调查询参数。 */
exports.verifyEmailUserAuthQuerySchema = zod_1.z.object({
    token: zod_1.z.string().min(1, '验证令牌不能为空'),
    callbackURL: exports.userAuthCallbackUrlSchema,
});
/** 忘记密码邮件请求。 */
exports.forgotPasswordUserAuthSchema = zod_1.z.object({
    email: zod_1.z.email('邮箱格式不正确'),
    redirectTo: exports.userAuthCallbackUrlSchema,
});
/** 密码重置业务回调路径参数。 */
exports.resetPasswordCallbackUserAuthParamsSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, '重置令牌不能为空'),
});
/** 密码重置业务回调查询参数。 */
exports.resetPasswordCallbackUserAuthQuerySchema = zod_1.z.object({
    callbackURL: exports.userAuthCallbackUrlSchema,
});
/** 使用邮件令牌设置新密码的请求。 */
exports.resetPasswordUserAuthSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, '重置令牌不能为空'),
    newPassword: exports.userAuthPasswordSchema,
});
/** 对外公开的普通用户信息，不包含认证令牌。 */
exports.userAuthUserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.email(),
    emailVerified: zod_1.z.boolean(),
    image: zod_1.z.string().nullable().optional(),
    createdAt: zod_1.z.iso.datetime(),
    updatedAt: zod_1.z.iso.datetime(),
});
/** 对外公开的脱敏 Session 信息，不包含 Session token。 */
exports.userAuthSessionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    expiresAt: zod_1.z.iso.datetime(),
    createdAt: zod_1.z.iso.datetime(),
    updatedAt: zod_1.z.iso.datetime(),
    ipAddress: zod_1.z.string().nullable().optional(),
    userAgent: zod_1.z.string().nullable().optional(),
});
/** 注册接口统一响应。 */
exports.registerUserAuthResponseSchema = zod_1.z.object({
    code: zod_1.z.literal(200),
    message: zod_1.z.literal('success'),
    data: exports.userAuthUserSchema,
});
/** 登录接口统一响应。 */
exports.loginUserAuthResponseSchema = zod_1.z.object({
    code: zod_1.z.literal(200),
    message: zod_1.z.literal('success'),
    data: exports.userAuthUserSchema,
});
/** Session 查询接口统一响应，游客的 data 为 null。 */
exports.sessionUserAuthResponseSchema = zod_1.z.object({
    code: zod_1.z.literal(200),
    message: zod_1.z.literal('success'),
    data: zod_1.z
        .object({
        user: exports.userAuthUserSchema,
        session: exports.userAuthSessionSchema,
    })
        .nullable(),
});
/** 通用认证操作结果。 */
exports.userAuthActionSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
});
/** 无数据认证操作的统一响应。 */
exports.userAuthActionResponseSchema = zod_1.z.object({
    code: zod_1.z.literal(200),
    message: zod_1.z.literal('success'),
    data: exports.userAuthActionSchema,
});
//# sourceMappingURL=schemas.js.map