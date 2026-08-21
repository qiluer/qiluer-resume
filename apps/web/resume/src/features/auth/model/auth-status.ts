import { z } from 'zod';

const authStatusSearchSchema = z.object({
  flow: z.enum(['verify-email', 'reset-password']).optional(),
  state: z.enum(['sent', 'success', 'ready']).optional(),
  error: z.string().min(1).optional(),
});

export type AuthStatusSearch = z.infer<typeof authStatusSearchSchema>;

export type AuthStatusView =
  | { kind: 'sent'; title: string; description: string }
  | { kind: 'success'; title: string; description: string }
  | { kind: 'error'; title: string; description: string }
  | { kind: 'unsupported'; title: string; description: string }
  | { kind: 'invalid'; title: string; description: string };

/** 宽容解析外部回调查询参数，非法值交给状态页展示安全兜底。 */
export function parseAuthStatusSearch(search: Record<string, unknown>): AuthStatusSearch {
  const result = authStatusSearchSchema.safeParse(search);
  return result.success ? result.data : {};
}

/** 把不可信 URL 参数归一化为只用于展示的认证状态。 */
export function resolveAuthStatus(search: AuthStatusSearch): AuthStatusView {
  if (search.flow === 'verify-email' && search.error) {
    if (search.error === 'TOKEN_EXPIRED') {
      return { kind: 'error', title: '验证链接已过期', description: '该邮箱验证链接已经失效，请重新注册以获取新的验证邮件。' };
    }
    if (search.error === 'INVALID_TOKEN') {
      return { kind: 'error', title: '验证链接无效', description: '该链接无效或已经被使用，你可以尝试直接登录或重新注册。' };
    }
    return { kind: 'error', title: '暂时无法验证邮箱', description: '验证过程中出现问题，请返回注册页重新尝试。' };
  }

  if (search.flow === 'verify-email' && search.state === 'sent') {
    return { kind: 'sent', title: '验证邮件已发送', description: '请点击邮件中的验证按钮完成账号注册。' };
  }

  if (search.flow === 'verify-email' && search.state === 'success') {
    return { kind: 'success', title: '邮箱验证成功', description: '你的账号已经创建完成，现在可以使用邮箱和密码登录。' };
  }

  if (search.flow === 'reset-password') {
    return { kind: 'unsupported', title: '密码重置暂不可用', description: '当前页面尚未开放密码重置操作，请返回登录页。' };
  }

  return { kind: 'invalid', title: '认证链接无效', description: '链接缺少必要信息或格式不正确，请返回登录页重新操作。' };
}

/** 脱敏邮箱本地部分，同时保留域名方便用户确认收件箱。 */
export function maskEmail(email: string): string {
  const separatorIndex = email.lastIndexOf('@');
  if (separatorIndex <= 0) return '***';

  const localPart = email.slice(0, separatorIndex);
  const domain = email.slice(separatorIndex + 1);
  const visiblePrefixLength = Math.min(2, localPart.length);
  return `${localPart.slice(0, visiblePrefixLength)}***@${domain}`;
}
