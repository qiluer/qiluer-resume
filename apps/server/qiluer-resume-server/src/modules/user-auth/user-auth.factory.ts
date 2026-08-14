import { prismaAdapter } from '@better-auth/prisma-adapter';
import { redisStorage } from '@better-auth/redis-storage';
import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import type { PrismaClient } from '@qiluer-resume/database';
import Redis from 'ioredis';

const DAY_IN_SECONDS = 60 * 60 * 24;

export interface AuthEmail {
  /** 收件人邮箱地址。 */
  to: string;
  /** 邮件主题。 */
  subject: string;
  /** HTML 邮件正文。 */
  html: string;
}

/** 创建普通用户 Better Auth 实例所需的基础设施选项。 */
export interface CreateUserAuthOptions {
  /** Prisma Client 实例。 */
  prisma: PrismaClient;
  /** Redis 实例。 */
  redisClient: Redis;
  /** Better Auth 签名密钥。 */
  secret: string;
  /** Better Auth 服务端绝对地址。 */
  baseURL: string;
  /** 允许作为认证回调目标的前端 Origin。 */
  trustedOrigins: string[];
  /** 是否启用生产环境安全 Cookie。 */
  isProduction: boolean;
  /** 项目邮件发送适配器。 */
  sendEmail: (email: AuthEmail) => Promise<void>;
  /** 邮件发送失败后的日志回调。 */
  onEmailError?: (error: unknown) => void;
}

/** 转义邮件模板中的 HTML 特殊字符。 */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return entities[character];
  });
}

/** 创建包含操作按钮和备用链接的认证邮件 HTML。 */
function createActionEmail(title: string, description: string, action: string, url: string): string {
  const safeUrl = escapeHtml(url);
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #18181b;">
      <h2>${title}</h2>
      <p>${description}</p>
      <p><a href="${safeUrl}" style="display: inline-block; padding: 10px 18px; color: #fff; background: #18181b; border-radius: 6px; text-decoration: none;">${action}</a></p>
      <p style="font-size: 12px; color: #71717a;">如果按钮无法点击，请复制以下链接到浏览器：<br />${safeUrl}</p>
    </div>
  `;
}

/** 把 Better Auth 原生邮件回调地址改写为公开的业务认证地址。 */
function createBusinessCallbackUrl(value: string): string {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/^\/api\/auth(?=\/|$)/, '/api/user-auth');
  return url.toString();
}

/** 在注册事务前拒绝已经存在的邮箱，使业务层可以返回明确的 30003 错误码。 */
const rejectDuplicateRegistration = createAuthMiddleware(async (context) => {
  if (context.path !== '/sign-up/email') return;
  const body = context.body as unknown;
  if (!body || typeof body !== 'object' || !('email' in body) || typeof body.email !== 'string') return;
  const existingUser = await context.context.internalAdapter.findUserByEmail(body.email.toLowerCase());
  if (!existingUser) return;
  throw APIError.from('CONFLICT', {
    code: 'EMAIL_ALREADY_REGISTERED',
    message: 'Email is already registered',
  });
});

/** 创建普通用户 Better Auth 实例。 */
export function createUserAuth(options: CreateUserAuthOptions) {
  const sendEmail = (email: AuthEmail): Promise<void> =>
    options.sendEmail(email).catch((error: unknown) => {
      options.onEmailError?.(error);
      throw error;
    });

  return betterAuth({
    appName: '柒陆贰简历',
    secret: options.secret,
    baseURL: options.baseURL,
    basePath: '/api/auth',
    trustedOrigins: options.trustedOrigins,
    database: prismaAdapter(options.prisma, { provider: 'postgresql' }),
    secondaryStorage: redisStorage({
      keyPrefix: 'resume:user-auth',
      client: options.redisClient,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      resetPasswordTokenExpiresIn: 60 * 30,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: ({ user, url }) => {
        const businessUrl = createBusinessCallbackUrl(url);
        return sendEmail({
          to: user.email,
          subject: '重置你的柒陆贰简历密码',
          html: createActionEmail('重置密码', '我们收到了你的密码重置请求。该链接将在 30 分钟后失效。', '重置密码', businessUrl),
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: false,
      sendVerificationEmail: ({ user, url }) => {
        const businessUrl = createBusinessCallbackUrl(url);
        return sendEmail({
          to: user.email,
          subject: '验证你的柒陆贰简历邮箱',
          html: createActionEmail('验证邮箱', '请验证你的邮箱地址，完成柒陆贰简历账号注册。', '验证邮箱', businessUrl),
        });
      },
    },
    session: {
      expiresIn: DAY_IN_SECONDS * 7,
      updateAge: DAY_IN_SECONDS,
      cookieCache: { enabled: false },
      storeSessionInDatabase: true,
    },
    rateLimit: {
      enabled: false,
    },
    hooks: {
      before: rejectDuplicateRegistration,
    },
    advanced: {
      useSecureCookies: options.isProduction,
      disableCSRFCheck: false,
      disableOriginCheck: false,
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: 'lax',
        secure: options.isProduction,
      },
    },
  });
}

/** 普通用户 Better Auth 实例类型。 */
export type UserAuth = ReturnType<typeof createUserAuth>;
/** 普通用户 Better Auth Session 推断类型。 */
export type UserAuthSession = UserAuth['$Infer']['Session'];
