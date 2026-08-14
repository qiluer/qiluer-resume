"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUserAuthDto = exports.ResetPasswordCallbackUserAuthQueryDto = exports.ResetPasswordCallbackUserAuthParamsDto = exports.ForgotPasswordUserAuthDto = exports.VerifyEmailUserAuthQueryDto = exports.SendVerificationEmailUserAuthDto = exports.LoginUserAuthDto = exports.RegisterUserAuthDto = void 0;
const dto_1 = require("nestjs-zod/dto");
const schemas_1 = require("./schemas");
/** 普通用户注册 DTO。 */
class RegisterUserAuthDto extends (0, dto_1.createZodDto)(schemas_1.registerUserAuthSchema) {
}
exports.RegisterUserAuthDto = RegisterUserAuthDto;
/** 普通用户登录 DTO。 */
class LoginUserAuthDto extends (0, dto_1.createZodDto)(schemas_1.loginUserAuthSchema) {
}
exports.LoginUserAuthDto = LoginUserAuthDto;
/** 重新发送验证邮件 DTO。 */
class SendVerificationEmailUserAuthDto extends (0, dto_1.createZodDto)(schemas_1.sendVerificationEmailUserAuthSchema) {
}
exports.SendVerificationEmailUserAuthDto = SendVerificationEmailUserAuthDto;
/** 邮箱验证业务回调查询 DTO。 */
class VerifyEmailUserAuthQueryDto extends (0, dto_1.createZodDto)(schemas_1.verifyEmailUserAuthQuerySchema) {
}
exports.VerifyEmailUserAuthQueryDto = VerifyEmailUserAuthQueryDto;
/** 忘记密码 DTO。 */
class ForgotPasswordUserAuthDto extends (0, dto_1.createZodDto)(schemas_1.forgotPasswordUserAuthSchema) {
}
exports.ForgotPasswordUserAuthDto = ForgotPasswordUserAuthDto;
/** 密码重置业务回调路径参数 DTO。 */
class ResetPasswordCallbackUserAuthParamsDto extends (0, dto_1.createZodDto)(schemas_1.resetPasswordCallbackUserAuthParamsSchema) {
}
exports.ResetPasswordCallbackUserAuthParamsDto = ResetPasswordCallbackUserAuthParamsDto;
/** 密码重置业务回调查询 DTO。 */
class ResetPasswordCallbackUserAuthQueryDto extends (0, dto_1.createZodDto)(schemas_1.resetPasswordCallbackUserAuthQuerySchema) {
}
exports.ResetPasswordCallbackUserAuthQueryDto = ResetPasswordCallbackUserAuthQueryDto;
/** 设置新密码 DTO。 */
class ResetPasswordUserAuthDto extends (0, dto_1.createZodDto)(schemas_1.resetPasswordUserAuthSchema) {
}
exports.ResetPasswordUserAuthDto = ResetPasswordUserAuthDto;
//# sourceMappingURL=dtos.js.map