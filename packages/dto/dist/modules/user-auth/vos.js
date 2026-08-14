"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthActionVO = exports.UserAuthActionDataVO = exports.SessionUserAuthVO = exports.LoginUserAuthVO = exports.RegisterUserAuthVO = exports.UserAuthSessionVO = exports.UserAuthUserVO = void 0;
const dto_1 = require("nestjs-zod/dto");
const schemas_1 = require("./schemas");
/** 对外公开的普通用户 VO。 */
class UserAuthUserVO extends (0, dto_1.createZodDto)(schemas_1.userAuthUserSchema) {
}
exports.UserAuthUserVO = UserAuthUserVO;
/** 不包含 Session token 的 Session VO。 */
class UserAuthSessionVO extends (0, dto_1.createZodDto)(schemas_1.userAuthSessionSchema) {
}
exports.UserAuthSessionVO = UserAuthSessionVO;
/** 注册接口统一响应 VO。 */
class RegisterUserAuthVO extends (0, dto_1.createZodDto)(schemas_1.registerUserAuthResponseSchema) {
}
exports.RegisterUserAuthVO = RegisterUserAuthVO;
/** 登录接口统一响应 VO。 */
class LoginUserAuthVO extends (0, dto_1.createZodDto)(schemas_1.loginUserAuthResponseSchema) {
}
exports.LoginUserAuthVO = LoginUserAuthVO;
/** Session 查询接口统一响应 VO。 */
class SessionUserAuthVO extends (0, dto_1.createZodDto)(schemas_1.sessionUserAuthResponseSchema) {
}
exports.SessionUserAuthVO = SessionUserAuthVO;
/** 通用认证操作数据 VO。 */
class UserAuthActionDataVO extends (0, dto_1.createZodDto)(schemas_1.userAuthActionSchema) {
}
exports.UserAuthActionDataVO = UserAuthActionDataVO;
/** 通用认证操作统一响应 VO。 */
class UserAuthActionVO extends (0, dto_1.createZodDto)(schemas_1.userAuthActionResponseSchema) {
}
exports.UserAuthActionVO = UserAuthActionVO;
//# sourceMappingURL=vos.js.map