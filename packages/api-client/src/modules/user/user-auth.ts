import {
  type ForgotPasswordUserAuthType,
  type LoginUserAuthType,
  type RegisterUserAuthType,
  type ResetPasswordUserAuthType,
  type SendVerificationEmailUserAuthType,
  type UserAuthActionType,
  type UserAuthSessionType,
  type UserAuthUserType,
  userAuthActionSchema,
  userAuthSessionSchema,
  userAuthUserSchema,
} from '@qiluer-resume/dto/schemas/user-auth';
import { z } from 'zod';
import type { ApiClient, ApiRequestConfig } from '../../core/http-client';

/** 用户认证服务端 API 的基础路径。 */
const USER_AUTH_PATH = '/user-auth';

/** 由浏览器直接访问的用户认证 API 基础路径。 */
const USER_AUTH_BROWSER_PATH = '/api/user-auth';

/** 当前认证会话响应的校验 Schema。 */
const sessionDataSchema = z.object({ user: userAuthUserSchema, session: userAuthSessionSchema }).nullable();

/** 用户注册、登录、会话及凭据恢复相关的 API。 */
export interface UserAuthApi {
  /**
   * 注册用户。
   *
   * @param input - 注册信息。
   * @param config - 可选的请求配置。
   * @returns 已注册的用户信息。
   */
  register(input: RegisterUserAuthType, config?: ApiRequestConfig): Promise<UserAuthUserType>;
  /**
   * 登录用户。
   *
   * @param input - 登录凭据。
   * @param config - 可选的请求配置。
   * @returns 已登录的用户信息。
   */
  login(input: LoginUserAuthType, config?: ApiRequestConfig): Promise<UserAuthUserType>;
  /**
   * 注销当前用户。
   *
   * @param config - 可选的请求配置。
   * @returns 注销操作的执行结果。
   */
  logout(config?: ApiRequestConfig): Promise<UserAuthActionType>;
  /**
   * 获取当前认证会话。
   *
   * @param config - 可选的请求配置。
   * @returns 当前用户及会话；未登录时返回 `null`。
   */
  getSession(config?: ApiRequestConfig): Promise<{ user: UserAuthUserType; session: UserAuthSessionType } | null>;
  /**
   * 发送验证邮箱邮件。
   *
   * @param input - 邮箱验证请求信息。
   * @param config - 可选的请求配置。
   * @returns 邮件发送操作的执行结果。
   */
  sendVerificationEmail(input: SendVerificationEmailUserAuthType, config?: ApiRequestConfig): Promise<UserAuthActionType>;
  /**
   * 发起忘记密码流程。
   *
   * @param input - 密码重置申请信息。
   * @param config - 可选的请求配置。
   * @returns 密码重置申请的执行结果。
   */
  forgotPassword(input: ForgotPasswordUserAuthType, config?: ApiRequestConfig): Promise<UserAuthActionType>;
  /**
   * 使用重置凭据设置新密码。
   *
   * @param input - 密码重置信息。
   * @param config - 可选的请求配置。
   * @returns 密码重置操作的执行结果。
   */
  resetPassword(input: ResetPasswordUserAuthType, config?: ApiRequestConfig): Promise<UserAuthActionType>;
  /**
   * 生成验证邮箱的浏览器访问地址。
   *
   * @param token - 邮箱验证令牌。
   * @returns 已安全编码令牌的验证地址。
   */
  getVerifyEmailUrl(token: string): string;
  /**
   * 生成重置密码回调的浏览器访问地址。
   *
   * @param token - 密码重置令牌。
   * @returns 已安全编码令牌的重置密码地址。
   */
  getResetPasswordCallbackUrl(token: string): string;
}

/**
 * 基于通用客户端创建用户认证 API。
 *
 * @param client - 用于发送和校验请求的 API 客户端。
 * @returns 用户认证 API facade。
 */
export function createUserAuthApi(client: ApiClient): UserAuthApi {
  return {
    register: (input, config) => client.post(`${USER_AUTH_PATH}/register`, userAuthUserSchema, input, config),
    login: (input, config) => client.post(`${USER_AUTH_PATH}/login`, userAuthUserSchema, input, config),
    logout: (config) => client.post(`${USER_AUTH_PATH}/logout`, userAuthActionSchema, undefined, config),
    getSession: (config) => client.get(`${USER_AUTH_PATH}/session`, sessionDataSchema, config),
    sendVerificationEmail: (input, config) => client.post(`${USER_AUTH_PATH}/send-verification-email`, userAuthActionSchema, input, config),
    forgotPassword: (input, config) => client.post(`${USER_AUTH_PATH}/forgot-password`, userAuthActionSchema, input, config),
    resetPassword: (input, config) => client.post(`${USER_AUTH_PATH}/reset-password`, userAuthActionSchema, input, config),
    getVerifyEmailUrl: (token) => `${USER_AUTH_BROWSER_PATH}/verify-email?${new URLSearchParams({ token })}`,
    getResetPasswordCallbackUrl: (token) => `${USER_AUTH_BROWSER_PATH}/reset-password/${encodeURIComponent(token)}`,
  };
}
