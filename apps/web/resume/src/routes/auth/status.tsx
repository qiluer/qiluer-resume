import { createFileRoute } from '@tanstack/react-router';
import { AuthStatusCard } from '@/features/auth/components/AuthStatusCard';
import { parseAuthStatusSearch, resolveAuthStatus } from '@/features/auth/model/auth-status';
import { getPendingVerificationEmail } from '@/features/auth/model/pending-verification';

export const Route = createFileRoute('/auth/status')({
  validateSearch: parseAuthStatusSearch,
  component: AuthStatusPage,
});

function AuthStatusPage() {
  const search = Route.useSearch();
  const view = resolveAuthStatus(search);
  const email = view.kind === 'sent' ? getPendingVerificationEmail() : null;

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-10">
      <AuthStatusCard view={view} email={email} />
    </main>
  );
}
