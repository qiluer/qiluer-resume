import type { ApiError } from '@qiluer-resume/api-client';
import type { ErrorPresentationEnum } from '@lib/errors/error-presenter';

/** 应用为 React Query 查询和 mutation 扩展的元数据。 */
interface AppQueryMeta extends Record<string, unknown> {
  errorPresentation?: ErrorPresentationEnum;
}

declare module '@tanstack/react-query' {
  /** 应用注册到 React Query 的全局类型配置。 */
  interface Register {
    defaultError: ApiError;
    queryMeta: AppQueryMeta;
    mutationMeta: AppQueryMeta;
  }
}
