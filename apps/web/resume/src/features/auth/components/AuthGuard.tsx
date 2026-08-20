import { redirect } from '@tanstack/react-router';
import { queryClient } from '@lib/query/client';
import { sessionOptions } from '../api/auth.options';

/**
 * AuthGuard：在路由 beforeLoad 中调用
 * - 未登录时抛出 redirect 到 /login
 * - 通过 QueryClient 查询服务端 Cookie Session，不依赖浏览器 token
 */
export async function requireAuth() {
  const session = await queryClient.ensureQueryData(sessionOptions());
  if (!session) throw redirect({ to: '/login' });
}

/**
 * 已登录守卫：用于 /login 页面 — 已登录访问时跳到 /home
 */
export async function redirectIfAuthed() {
  const session = await queryClient.ensureQueryData(sessionOptions());
  if (session) throw redirect({ to: '/home' });
}
