import { QueryClient } from '@tanstack/react-query';

/**
 * 全局 QueryClient 单例
 * - 适合绝大多数业务场景的默认值
 * - 特殊场景（按需重试、单独缓存策略）在调用 useQuery 时覆盖
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
