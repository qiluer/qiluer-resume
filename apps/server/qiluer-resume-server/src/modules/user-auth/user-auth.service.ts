import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService as NestBetterAuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { isAPIError } from 'better-auth/api';
import type { IncomingHttpHeaders } from 'http';
import {
  ErrorCodeEnum,
  type ForgotPasswordUserAuthType,
  type LoginUserAuthType,
  type RegisterUserAuthType,
  type ResetPasswordCallbackUserAuthParamsType,
  type ResetPasswordUserAuthType,
  type SendVerificationEmailUserAuthType,
  type UserAuthActionType,
  type UserAuthSessionType,
  type UserAuthUserType,
  type VerifyEmailUserAuthQueryType,
} from '@qiluer-resume/dto';
import { BusinessException } from '@/common/errors/business.exception';
import type { UserAuth } from './user-auth.factory';

/** Better Auth API 调用后需要返回给 Controller 的业务数据与响应头。 */
export interface UserAuthServiceResult<T> {
  /** 已移除敏感认证令牌的业务数据。 */
  data: T;
  /** Better Auth 生成的响应头，主要用于透传 Set-Cookie。 */
  headers: Headers;
}

/** Better Auth 用户对象所需的最小结构。 */
interface BetterAuthUserLike {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Better Auth Session 对象所需的最小结构。 */
interface BetterAuthSessionLike {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/** 前端统一认证回调页需要处理的业务流程。 */
type UserAuthCallbackFlow = 'verify-email' | 'reset-password';

/**
 * 普通用户认证业务服务。
 *
 * 负责调用 Better Auth Server API、映射业务错误、移除响应中的 Session token，
 * 并把需要由 Controller 写回的 Cookie 响应头一并返回。
 */
@Injectable()
export class UserAuthService {
  /** 由服务端配置并验证过的前端统一认证回调地址。 */
  private readonly callbackURL: URL;

  constructor(
    private readonly authService: NestBetterAuthService<UserAuth>,
    configService: ConfigService,
  ) {
    const callbackURLValue = configService.get<string>('USER_AUTH_CALLBACK_URL')?.trim();
    if (!callbackURLValue) throw new Error('USER_AUTH_CALLBACK_URL is not defined in the root .env file');

    let callbackURL: URL;
    try {
      callbackURL = new URL(callbackURLValue);
    } catch {
      throw new Error('USER_AUTH_CALLBACK_URL must be a valid absolute URL');
    }
    if (callbackURL.protocol !== 'http:' && callbackURL.protocol !== 'https:') {
      throw new Error('USER_AUTH_CALLBACK_URL must use the http or https protocol');
    }

    const trustedOrigins = (configService.get<string>('BETTER_AUTH_TRUSTED_ORIGINS') ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const trusted = trustedOrigins.some((trustedOrigin) => {
      try {
        return new URL(trustedOrigin).origin === callbackURL.origin;
      } catch {
        return false;
      }
    });
    if (!trusted) throw new Error('USER_AUTH_CALLBACK_URL origin must be included in BETTER_AUTH_TRUSTED_ORIGINS');

    this.callbackURL = callbackURL;
  }

  /** 注册普通用户并触发邮箱验证邮件。 */
  async register(body: RegisterUserAuthType, requestHeaders: IncomingHttpHeaders): Promise<UserAuthServiceResult<UserAuthUserType>> {
    return this.execute(async () => {
      const result = await this.authService.api.signUpEmail({
        body: { ...body, callbackURL: this.createCallbackURL('verify-email') },
        headers: fromNodeHeaders(requestHeaders),
        returnHeaders: true,
      });
      return { data: this.toUserVO(result.response.user), headers: result.headers };
    });
  }

  /** 使用邮箱和密码登录，并返回待写入浏览器的 Session Cookie。 */
  async login(body: LoginUserAuthType, requestHeaders: IncomingHttpHeaders): Promise<UserAuthServiceResult<UserAuthUserType>> {
    return this.execute(async () => {
      const result = await this.authService.api.signInEmail({
        body: { ...body, callbackURL: this.createCallbackURL('verify-email') },
        headers: fromNodeHeaders(requestHeaders),
        returnHeaders: true,
      });
      return { data: this.toUserVO(result.response.user), headers: result.headers };
    });
  }

  /** 撤销当前 Session，并返回清除 Session Cookie 所需的响应头。 */
  async logout(requestHeaders: IncomingHttpHeaders): Promise<UserAuthServiceResult<UserAuthActionType>> {
    return this.execute(async () => {
      const result = await this.authService.api.signOut({
        headers: fromNodeHeaders(requestHeaders),
        returnHeaders: true,
      });
      return { data: result.response, headers: result.headers };
    });
  }

  /** 查询当前 Session；游客返回 null，且永不向客户端暴露 Session token。 */
  async getSession(
    requestHeaders: IncomingHttpHeaders,
  ): Promise<UserAuthServiceResult<{ user: UserAuthUserType; session: UserAuthSessionType } | null>> {
    return this.execute(async () => {
      const result = await this.authService.api.getSession({
        headers: fromNodeHeaders(requestHeaders),
        returnHeaders: true,
      });
      if (!result.response) return { data: null, headers: result.headers };
      return {
        data: {
          user: this.toUserVO(result.response.user),
          session: this.toSessionVO(result.response.session),
        },
        headers: result.headers,
      };
    });
  }

  /** 重新发送邮箱验证邮件，并保持账号枚举防护。 */
  async sendVerificationEmail(
    body: SendVerificationEmailUserAuthType,
    requestHeaders: IncomingHttpHeaders,
  ): Promise<UserAuthServiceResult<UserAuthActionType>> {
    return this.execute(async () => {
      const result = await this.authService.api.sendVerificationEmail({
        body: { ...body, callbackURL: this.createCallbackURL('verify-email') },
        headers: fromNodeHeaders(requestHeaders),
        returnHeaders: true,
      });
      return { data: { success: result.response.status }, headers: result.headers };
    });
  }

  /** 验证邮箱令牌，并返回需要原样转发给浏览器的 302 Response。 */
  async verifyEmail(query: VerifyEmailUserAuthQueryType, requestHeaders: IncomingHttpHeaders): Promise<globalThis.Response> {
    return this.authService.api.verifyEmail({
      query: { ...query, callbackURL: this.createCallbackURL('verify-email') },
      headers: fromNodeHeaders(requestHeaders),
      asResponse: true,
    });
  }

  /** 请求密码重置邮件；无论邮箱是否存在都返回相同结果。 */
  async forgotPassword(body: ForgotPasswordUserAuthType, requestHeaders: IncomingHttpHeaders): Promise<UserAuthServiceResult<UserAuthActionType>> {
    return this.execute(async () => {
      const result = await this.authService.api.requestPasswordReset({
        body: { ...body, redirectTo: this.createCallbackURL('reset-password') },
        headers: fromNodeHeaders(requestHeaders),
        returnHeaders: true,
      });
      return { data: { success: result.response.status }, headers: result.headers };
    });
  }

  /** 校验密码重置令牌，并返回需要原样转发给浏览器的 302 Response。 */
  async resetPasswordCallback(params: ResetPasswordCallbackUserAuthParamsType, requestHeaders: IncomingHttpHeaders): Promise<globalThis.Response> {
    return this.authService.api.requestPasswordResetCallback({
      params,
      query: { callbackURL: this.createCallbackURL('reset-password') },
      headers: fromNodeHeaders(requestHeaders),
      asResponse: true,
    });
  }

  /** 使用一次性令牌设置新密码，并由 Better Auth 撤销用户全部旧 Session。 */
  async resetPassword(body: ResetPasswordUserAuthType, requestHeaders: IncomingHttpHeaders): Promise<UserAuthServiceResult<UserAuthActionType>> {
    return this.execute(async () => {
      const result = await this.authService.api.resetPassword({
        body,
        headers: fromNodeHeaders(requestHeaders),
        returnHeaders: true,
      });
      return { data: { success: result.response.status }, headers: result.headers };
    });
  }

  /** 执行 Better Auth 调用并将库错误稳定映射为项目业务错误。 */
  private async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      if (!isAPIError(error)) throw error;

      const code = error.body?.code;
      if (code === 'EMAIL_ALREADY_REGISTERED') throw new BusinessException(ErrorCodeEnum.邮箱已被注册);
      if (code === 'INVALID_EMAIL_OR_PASSWORD') throw new BusinessException(ErrorCodeEnum.邮箱或密码错误);
      if (code === 'EMAIL_NOT_VERIFIED') throw new BusinessException(ErrorCodeEnum.邮箱未验证);
      if (code === 'TOKEN_EXPIRED') throw new BusinessException(ErrorCodeEnum.Token已过期);
      if (code === 'INVALID_TOKEN') throw new BusinessException(ErrorCodeEnum.Token无效);
      if (error.statusCode === 429 || error.status === 'TOO_MANY_REQUESTS') throw new BusinessException(ErrorCodeEnum.请求过于频繁);
      if (error.statusCode >= 500) throw new BusinessException(ErrorCodeEnum.服务内部错误);
      throw new BusinessException(ErrorCodeEnum.参数校验失败, code);
    }
  }

  /** 基于服务端固定地址生成带流程标识的前端认证回调 URL。 */
  private createCallbackURL(flow: UserAuthCallbackFlow): string {
    const callbackURL = new URL(this.callbackURL);
    callbackURL.searchParams.set('flow', flow);
    return callbackURL.toString();
  }

  /** 把 Better Auth 用户对象转换为稳定、无令牌的公开 VO。 */
  private toUserVO(user: BetterAuthUserLike): UserAuthUserType {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? '',
    };
  }

  /** 把 Better Auth Session 转换为不包含 token 的公开 VO。 */
  private toSessionVO(session: BetterAuthSessionLike): UserAuthSessionType {
    return {
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress ?? '',
      userAgent: session.userAgent ?? '',
    };
  }
}
