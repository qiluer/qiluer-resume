import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { LoginForm, redirectIfAuthed } from '@features/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    // 已登录用户访问 /login 时自动跳到 /home
    await redirectIfAuthed();
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LoginForm onSuccess={() => void navigate({ to: '/home' })} />
    </main>
  );
}
