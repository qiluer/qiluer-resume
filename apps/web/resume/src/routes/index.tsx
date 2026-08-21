import { redirect, createFileRoute } from '@tanstack/react-router';
import { queryClient } from '@lib/query/client';
import { sessionOptions } from '@features/auth';
import { ApiErrorKind, normalizeApiError } from '@qiluer-resume/api-client';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    let session = null;
    try {
      session = await queryClient.ensureQueryData(sessionOptions());
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (([ApiErrorKind.Network, ApiErrorKind.Timeout, ApiErrorKind.Server] as ApiErrorKind[]).includes(apiError.kind)) {
        throw redirect({ to: '/login' });
      }
      throw error;
    }
    throw redirect({ to: session ? '/home' : '/login' });
  },
});
