import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiErrorKind, isApiError, normalizeApiError } from '@qiluer-resume/api-client';
import { ErrorCodeEnum } from '@qiluer-resume/dto/error';
import { ErrorPresentationEnum, errorPresenter } from '@lib/errors/error-presenter';

/** 需要清空查询缓存并跳转登录页的认证错误码集合。 */
export const authenticationErrorCodes = new Set<number>([ErrorCodeEnum.未登录, ErrorCodeEnum.Token已过期, ErrorCodeEnum.Token无效]);

/**
 * 判断失败的查询是否应当重试。
 *
 * @param failureCount - 当前查询已经失败的次数。
 * @param error - 本次查询抛出的错误。
 * @returns 仅在首次网络错误或超时错误时返回 `true`。
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  return failureCount < 1 && isApiError(error) && (error.kind === ApiErrorKind.Network || error.kind === ApiErrorKind.Timeout);
}

/**
 * 统一处理查询与 mutation 抛出的错误。
 *
 * @param error - 请求过程中抛出的未知错误。
 * @param mode - 标准化错误的展示方式。
 */
function handleGlobalError(error: unknown, mode: ErrorPresentationEnum): void {
  const apiError = normalizeApiError(error);

  if (apiError.kind === ApiErrorKind.Cancelled) return;

  if (apiError.code !== undefined && authenticationErrorCodes.has(apiError.code)) {
    queryClient.clear();
    if (window.location.pathname !== '/login') window.location.assign('/login');
    return;
  }

  if (mode === ErrorPresentationEnum.Silent) return;

  errorPresenter.present(apiError, mode);
}

/** 为所有查询提供统一错误处理的 React Query 缓存。 */
export const queryCache = new QueryCache({
  onError: (error, query) => {
    const configuredMode: ErrorPresentationEnum = query.meta?.errorPresentation ?? ErrorPresentationEnum.Toast;
    if (configuredMode === ErrorPresentationEnum.Silent || query.state.data === undefined) return;
    handleGlobalError(error, configuredMode);
  },
});

/** 为所有 mutation 提供统一错误处理的 React Query 缓存。 */
export const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    handleGlobalError(error, mutation.meta?.errorPresentation ?? ErrorPresentationEnum.Dialog);
  },
});

/** 应用共享的 React Query 客户端实例及其默认策略。 */
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
