import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并条件 className，并解决 Tailwind CSS 工具类冲突。
 *
 * @param inputs - 类名、条件类名或嵌套类名集合。
 * @returns 合并并去除冲突后的 className 字符串。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
