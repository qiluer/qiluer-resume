import axios from 'axios';
import { respondDataSchema } from '@qiluer-resume/dto/schemas/respond';
import { ErrorCodeEnum } from '@qiluer-resume/dto/error';

/** API 错误的分类常量。 */
export const ApiErrorKind = {
  /** 业务错误。 */
  Business: 'business',
  /** 网络错误。 */
  Network: 'network',
  /** 超时错误。 */
  Timeout: 'timeout',
  /** 请求已取消错误。 */
  Cancelled: 'cancelled',
  /** 协议错误。 */
  Protocol: 'protocol',
  /** 服务端错误。 */
  Server: 'server',
  /** 未知错误。 */
  Unknown: 'unknown',
} as const;

/** API 错误分类。 */
export type ApiErrorKind = (typeof ApiErrorKind)[keyof typeof ApiErrorKind];

/** 创建 {@link ApiError} 时使用的结构化错误信息。 */
export interface ApiErrorOptions {
  /** 错误分类。 */
  kind: ApiErrorKind;
  /** 服务端返回的业务错误码。 */
  code?: number;
  /** 用于诊断错误的附加数据。 */
  details?: unknown;
  /** HTTP 响应状态码。 */
  status?: number;
  /** 导致当前错误的原始异常。 */
  cause?: unknown;
}

/** API 层对外抛出的唯一错误类型。 */
export class ApiError extends Error {
  /** 错误分类。 */
  readonly kind: ApiErrorKind;
  /** 服务端返回的业务错误码。 */
  readonly code?: ErrorCodeEnum;
  /** 用于诊断错误的附加数据。 */
  readonly details?: unknown;
  /** HTTP 响应状态码。 */
  readonly status?: number;
  /** 导致当前错误的原始异常。 */
  override readonly cause?: unknown;

  /**
   * 创建统一的 API 错误。
   *
   * @param message - 面向调用方的错误消息。
   * @param options - 错误分类及可选的上下文信息。
   */
  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.kind = options.kind;
    this.code = options.code;
    this.details = options.details;
    this.status = options.status;
    this.cause = options.cause;
  }
}

/**
 * 判断未知值是否为 {@link ApiError}。
 *
 * @param error - 待判断的值。
 * @returns 当该值是 `ApiError` 实例时返回 `true`。
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * 把 Axios、网络和未知错误归一化，供 React Query 与命令式调用共用。
 *
 * @param error - 原始错误或任意抛出值。
 * @returns 原错误或根据错误上下文创建的 {@link ApiError}。
 */
export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (axios.isCancel(error) || (axios.isAxiosError(error) && error.code === 'ERR_CANCELED')) {
    return new ApiError('请求已取消', { kind: 'cancelled', cause: error });
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError('请求超时，请稍后重试', { kind: 'timeout', cause: error });
    }

    const envelope = respondDataSchema.safeParse(error.response?.data);
    if (envelope.success && envelope.data.code !== 0) {
      return new ApiError(envelope.data.message, {
        kind: 'business',
        code: envelope.data.code,
        details: envelope.data.data,
        status: error.response?.status,
        cause: error,
      });
    }

    if (error.response) {
      return new ApiError('服务暂时不可用，请稍后重试', {
        kind: 'server',
        status: error.response.status,
        details: error.response.data,
        cause: error,
      });
    }

    return new ApiError('网络连接失败，请检查网络后重试', { kind: 'network', cause: error });
  }

  if (error instanceof Error) {
    return new ApiError(error.message || '发生未知错误', { kind: 'unknown', cause: error });
  }

  return new ApiError('发生未知错误', { kind: 'unknown', details: error });
}
