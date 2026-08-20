import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiErrorKind, isApiError, normalizeApiError } from '@qiluer-resume/api-client';
import { ErrorCodeEnum } from '@qiluer-resume/dto/error';
import { placeholderErrorPresenter, type ErrorPresentation } from '@lib/errors/error-presenter';

export const authenticationErrorCodes = new Set<number>([ErrorCodeEnum.未登录, ErrorCodeEnum.Token已过期, ErrorCodeEnum.Token无效]);

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  return failureCount < 1 && isApiError(error) && (error.kind === ApiErrorKind.Network || error.kind === ApiErrorKind.Timeout);
}

function handleGlobalError(error: unknown, mode: ErrorPresentation): void {
  const apiError = normalizeApiError(error);

  if (apiError.kind === ApiErrorKind.Cancelled) return;

  if (apiError.code !== undefined && authenticationErrorCodes.has(apiError.code)) {
    queryClient.clear();
    if (window.location.pathname !== '/login') window.location.assign('/login');
    return;
  }

  if (mode === 'silent') return;

  placeholderErrorPresenter.present(apiError, mode);
}

export const queryCache = new QueryCache({
  onError: (error, query) => {
    const configuredMode = query.meta?.errorPresentation ?? 'dialog';
    const mode = configuredMode === 'silent' || query.state.data === undefined ? configuredMode : 'toast';
    handleGlobalError(error, mode);
  },
});

export const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    handleGlobalError(error, mutation.meta?.errorPresentation ?? 'dialog');
  },
});

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
