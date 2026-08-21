import type { ApiError } from '@qiluer-resume/api-client';
import { toast } from '@components/ui/toast';
import { useErrorDialogStore } from './error-dialog.store';

/** 支持的全局错误展示方式。 */
export const ErrorPresentationEnum = {
  Dialog: 'dialog',
  Toast: 'toast',
  Silent: 'silent',
} as const;

/** 全局错误展示方式的联合类型。 */
export type ErrorPresentationEnum = (typeof ErrorPresentationEnum)[keyof typeof ErrorPresentationEnum];

/** 将标准化 API 错误转换为用户可见反馈的展示器。 */
export interface ErrorPresenter {
  present(error: ApiError, mode: ErrorPresentationEnum): void;
}

/**
 * 默认的错误展示器。
 *
 * 它根据错误的分类和模式，选择不同的展示方式。
 * 如果错误是业务错误，且模式为 `dialog`，则会弹出错误对话框。
 * 如果错误是业务错误，且模式为 `toast`，则会添加错误 toast。
 * 如果错误是业务错误，且模式为 `silent`，则会静默处理错误。
 */
export const errorPresenter: ErrorPresenter = {
  present(error, mode) {
    if (import.meta.env.DEV) console.error(`[API error:${mode}]`, error);

    if (mode === ErrorPresentationEnum.Silent) return;

    if (mode === ErrorPresentationEnum.Toast) {
      toast.add({
        type: 'error',
        title: '操作失败',
        description: error.message,
        priority: 'high',
      });
      return;
    }

    useErrorDialogStore.getState().show({
      title: '操作失败',
      message: error.message,
    });
  },
};
