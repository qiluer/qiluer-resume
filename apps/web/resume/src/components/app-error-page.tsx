import type { ReactElement } from 'react';
import type { ErrorComponentProps } from '@tanstack/react-router';

export function AppErrorPage({ error }: ErrorComponentProps): ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10" role="alert">
      <section className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">页面暂时无法加载</h1>
        <p className="mt-2 text-sm text-gray-500">服务暂时不可用，请稍后重试。</p>

        {import.meta.env.DEV && (
          <pre className="mt-4 overflow-auto rounded-md bg-red-50 p-3 text-left text-xs whitespace-pre-wrap text-red-700">{error.message}</pre>
        )}

        <button
          type="button"
          className="mt-6 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
          onClick={() => window.location.reload()}
        >
          重新加载
        </button>
      </section>
    </main>
  );
}
