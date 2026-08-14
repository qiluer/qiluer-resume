import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/home')({
  beforeLoad: () => {},
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
        >
          登出
        </button>
      </header>

      <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <h2 className="text-lg font-medium text-gray-900">qiluer-resume 前端骨架已就绪</h2>
      </section>
    </main>
  );
}
