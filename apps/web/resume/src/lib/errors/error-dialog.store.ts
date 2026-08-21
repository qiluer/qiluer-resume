import { create } from 'zustand';

/** 错误对话框展示的标题与消息内容。 */
export interface ErrorDialogContent {
  title: string;
  message: string;
}

/** 错误对话框队列的状态与操作。 */
interface ErrorDialogState {
  /** 当前待展示的错误对话框队列。 */
  queue: ErrorDialogContent[];
  /** 显示新的错误对话框。 */
  show(content: ErrorDialogContent): void;
  /** 关闭当前展示的错误对话框。 */
  dismiss(): void;
}

/** 管理全局错误对话框队列的 Zustand Store。 */
export const useErrorDialogStore = create<ErrorDialogState>((set) => ({
  queue: [],
  show: (content) => set((state) => ({ queue: [...state.queue, content] })),
  dismiss: () => set((state) => ({ queue: state.queue.slice(1) })),
}));
