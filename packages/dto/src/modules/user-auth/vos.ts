import { createZodDto } from 'nestjs-zod/dto';
import {
  loginUserAuthResponseSchema,
  registerUserAuthResponseSchema,
  sessionUserAuthResponseSchema,
  userAuthActionResponseSchema,
  userAuthActionSchema,
  userAuthSessionSchema,
  userAuthUserSchema,
} from './schemas';

/** 对外公开的普通用户 VO。 */
export class UserAuthUserVO extends createZodDto(userAuthUserSchema) {}

/** 不包含 Session token 的 Session VO。 */
export class UserAuthSessionVO extends createZodDto(userAuthSessionSchema) {}

/** 注册接口统一响应 VO。 */
export class RegisterUserAuthVO extends createZodDto(registerUserAuthResponseSchema) {}

/** 登录接口统一响应 VO。 */
export class LoginUserAuthVO extends createZodDto(loginUserAuthResponseSchema) {}

/** Session 查询接口统一响应 VO。 */
export class SessionUserAuthVO extends createZodDto(sessionUserAuthResponseSchema) {}

/** 通用认证操作数据 VO。 */
export class UserAuthActionDataVO extends createZodDto(userAuthActionSchema) {}

/** 通用认证操作统一响应 VO。 */
export class UserAuthActionVO extends createZodDto(userAuthActionResponseSchema) {}
