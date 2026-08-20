import type { ApiError } from '@qiluer-resume/api-client';
import type { ErrorPresentation } from '@lib/errors/error-presenter';

interface AppQueryMeta extends Record<string, unknown> {
  errorPresentation?: ErrorPresentation;
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
    queryMeta: AppQueryMeta;
    mutationMeta: AppQueryMeta;
  }
}
