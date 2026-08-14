/**
 * 集中管理 React Query 的 queryKey
 * - 便于失效（invalidateQueries）与缓存命中复用
 * - 推荐使用 ['namespace', 'entity', { filters }] 层级结构
 */
export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  user: {
    list: (params?: Record<string, unknown>) => ['user', 'list', params ?? {}] as const,
    detail: (id: string | number) => ['user', 'detail', id] as const,
  },
} as const;
