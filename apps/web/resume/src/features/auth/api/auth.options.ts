import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { LoginUserAuthType, RegisterUserAuthType, SendVerificationEmailUserAuthType } from '@qiluer-resume/dto/schemas/user-auth';
import { userAuthApi } from '@lib/api/client';

/** 用户认证相关查询与 mutation 的键工厂。 */
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

/** 创建获取当前用户会话的查询选项。 */
export function sessionOptions() {
  return queryOptions({
    queryKey: authKeys.session(),
    queryFn: ({ signal }) => userAuthApi.getSession({ signal }),
    staleTime: 60_000,
    meta: { errorPresentation: 'silent' },
  });
}

/** 创建用户注册的 mutation 选项。 */
export function registerMutationOptions() {
  return mutationOptions({
    mutationKey: [...authKeys.all, 'register'] as const,
    mutationFn: (input: RegisterUserAuthType) => userAuthApi.register(input),
  });
}

/** 创建发送邮箱验证码的 mutation 选项。 */
export function sendVerificationEmailMutationOptions() {
  return mutationOptions({
    mutationKey: [...authKeys.all, 'send-verification-email'] as const,
    mutationFn: (input: SendVerificationEmailUserAuthType) => userAuthApi.sendVerificationEmail(input),
    meta: { errorPresentation: 'silent' },
  });
}

/** 创建用户登录的 mutation 选项。 */
export function loginMutationOptions() {
  return mutationOptions({
    mutationKey: [...authKeys.all, 'login'] as const,
    mutationFn: (input: LoginUserAuthType) => userAuthApi.login(input),
  });
}

/** 创建用户退出登录的 mutation 选项。 */
export function logoutMutationOptions() {
  return mutationOptions({
    mutationKey: [...authKeys.all, 'logout'] as const,
    mutationFn: () => userAuthApi.logout(),
  });
}
