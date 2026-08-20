import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { router } from '@app/router';
import { queryClient } from '@lib/query/client';

interface ProvidersProps {
  children?: ReactNode;
}

/**
 * 全局 Providers 组合
 * - QueryClientProvider 必须位于 RouterProvider 之外，确保 useQuery 可在路由守卫中使用
 * - 开发环境下挂载两套 Devtools
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children ?? <RouterProvider router={router} />}
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          <TanStackRouterDevtools router={router} />
        </>
      )}
    </QueryClientProvider>
  );
}
