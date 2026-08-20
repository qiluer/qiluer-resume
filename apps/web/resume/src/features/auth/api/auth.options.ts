import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { LoginUserAuthType } from '@qiluer-resume/dto/schemas/user-auth';
import { userAuthApi } from '@lib/api/client';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

export function sessionOptions() {
  return queryOptions({
    queryKey: authKeys.session(),
    queryFn: ({ signal }) => userAuthApi.getSession({ signal }),
    staleTime: 60_000,
    meta: { errorPresentation: 'silent' },
  });
}

export function loginMutationOptions() {
  return mutationOptions({
    mutationKey: [...authKeys.all, 'login'] as const,
    mutationFn: (input: LoginUserAuthType) => userAuthApi.login(input),
  });
}

export function logoutMutationOptions() {
  return mutationOptions({
    mutationKey: [...authKeys.all, 'logout'] as const,
    mutationFn: () => userAuthApi.logout(),
  });
}
