import { redirectIfAuthed } from '@/features/auth';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { setPendingVerificationEmail } from '@/features/auth/model/pending-verification';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    await redirectIfAuthed();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const handleSuccess = (email: string) => {
    setPendingVerificationEmail(email);
    void navigate({ to: '/auth/status', search: { flow: 'verify-email', state: 'sent' } });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
