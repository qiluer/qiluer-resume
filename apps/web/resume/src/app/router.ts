import { createRouter } from '@tanstack/react-router';
import { AppErrorPage } from '@components/app-error-page';
import { routeTree } from '../routeTree.gen';

/**
 * 应用路由单例
 * - 由 src/routes/* 文件式路由 + @tanstack/router-plugin 自动生成 routeTree.gen.ts
 * - 首次启动 dev / build 时若该文件不存在，Vite 插件会自动创建
 * - 业务模块（zustand / react-query）以单例形式直接 import，无需通过 context 传递
 */
export const router = createRouter({
  routeTree,
  defaultErrorComponent: AppErrorPage,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// 类型注册：让 Link / useNavigate 等 API 具备完整类型推断
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
