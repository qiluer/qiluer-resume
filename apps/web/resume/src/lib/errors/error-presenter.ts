import type { ApiError } from '@qiluer-resume/api-client';

export type ErrorPresentation = 'dialog' | 'toast' | 'silent';

export interface ErrorPresenter {
  present(error: ApiError, mode: ErrorPresentation): void;
}

/**
 * Dialog/Toast 接入前的占位实现。
 * 生产环境无可见副作用，后续只需替换该 Presenter，无需修改请求和 Query 层。
 */
export const placeholderErrorPresenter: ErrorPresenter = {
  present(error, mode) {
    console.error(error);
    if (mode === 'silent') return;
    if (import.meta.env.DEV) console.error(`[API error:${mode}]`, error);
  },
};
