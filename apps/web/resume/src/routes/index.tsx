import { redirect, createFileRoute } from '@tanstack/react-router';
import { redirectIfAuthed } from '@features/auth';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // 已登录直接进首页；未登录走 AuthGuard 由 /home 抛出到 /login
    redirectIfAuthed();
    throw redirect({ to: '/home' });
  },
});
