import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '@features/auth/stores/auth.store';

/**
 * AuthGuard：在路由 beforeLoad 中调用
 * - 未登录时抛出 redirect 到 /login
 * - 通过 useAuthStore.getState() 同步读取，避免 React 渲染时机问题
 */
export function requireAuth() {
  const { token } = useAuthStore.getState();
  if (!token) {
    throw redirect({ to: '/login' });
  }
}

/**
 * 已登录守卫：用于 /login 页面 — 已登录访问时跳到 /home
 */
export function redirectIfAuthed() {
  const { token } = useAuthStore.getState();
  if (token) {
    throw redirect({ to: '/home' });
  }
}
