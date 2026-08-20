import axios, { type AxiosInstance, type AxiosRequestConfig, type CreateAxiosDefaults } from 'axios';
import { respondDataSchema, SUCCESS_CODE } from '@qiluer-resume/dto/schemas/respond';
import { type z } from 'zod';
import { ApiError, normalizeApiError } from './api-error';

/**
 * API 请求的通用配置。
 *
 * URL、请求方法、请求体和查询参数由具体请求方法单独提供。
 */
export type ApiRequestConfig = Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'params'>;

/** 负责发送请求、校验响应并统一错误类型的 API 客户端。 */
export interface ApiClient {
  /**
   * 发送请求并按指定 Schema 校验响应数据。
   *
   * @param config - Axios 请求配置。
   * @param dataSchema - 用于校验响应数据的 Zod Schema。
   * @returns Schema 校验后的响应数据。
   * @throws {@link ApiError} 当响应信封、业务状态或响应数据校验失败时抛出。
   */
  request<TSchema extends z.ZodType>(config: AxiosRequestConfig, dataSchema: TSchema): Promise<z.output<TSchema>>;
  /**
   * 发送 GET 请求。
   *
   * @param url - 请求地址。
   * @param dataSchema - 用于校验响应数据的 Zod Schema。
   * @param config - 可选的请求配置和查询参数。
   * @returns Schema 校验后的响应数据。
   * @throws {@link ApiError} 当请求失败或响应不符合约定时抛出。
   */
  get<TSchema extends z.ZodType>(url: string, dataSchema: TSchema, config?: ApiRequestConfig & { params?: unknown }): Promise<z.output<TSchema>>;
  /**
   * 发送 POST 请求。
   *
   * @param url - 请求地址。
   * @param dataSchema - 用于校验响应数据的 Zod Schema。
   * @param data - 可选的请求体。
   * @param config - 可选的请求配置。
   * @returns Schema 校验后的响应数据。
   * @throws {@link ApiError} 当请求失败或响应不符合约定时抛出。
   */
  post<TSchema extends z.ZodType>(url: string, dataSchema: TSchema, data?: unknown, config?: ApiRequestConfig): Promise<z.output<TSchema>>;
  /**
   * 发送 PATCH 请求。
   *
   * @param url - 请求地址。
   * @param dataSchema - 用于校验响应数据的 Zod Schema。
   * @param data - 可选的请求体。
   * @param config - 可选的请求配置。
   * @returns Schema 校验后的响应数据。
   * @throws {@link ApiError} 当请求失败或响应不符合约定时抛出。
   */
  patch<TSchema extends z.ZodType>(url: string, dataSchema: TSchema, data?: unknown, config?: ApiRequestConfig): Promise<z.output<TSchema>>;
  /**
   * 发送 DELETE 请求。
   *
   * @param url - 请求地址。
   * @param dataSchema - 用于校验响应数据的 Zod Schema。
   * @param config - 可选的请求配置。
   * @returns Schema 校验后的响应数据。
   * @throws {@link ApiError} 当请求失败或响应不符合约定时抛出。
   */
  delete<TSchema extends z.ZodType>(url: string, dataSchema: TSchema, config?: ApiRequestConfig): Promise<z.output<TSchema>>;
  /**
   * 发送请求并直接返回响应体，不校验统一响应信封。
   *
   * @param config - Axios 请求配置。
   * @returns 原始响应体。
   * @throws {@link ApiError} 当请求失败时抛出。
   */
  requestRaw<TData = unknown>(config: AxiosRequestConfig): Promise<TData>;
}

/** 创建 API 客户端时使用的 Axios 配置。 */
export interface CreateApiClientOptions extends CreateAxiosDefaults {
  /**
   * 可复用的 Axios 实例；未提供时根据其余配置创建新实例。
   *
   * @defaultValue 根据其余选项调用 `axios.create` 创建的实例。
   */
  axiosInstance?: AxiosInstance;
}

/**
 * 创建负责响应校验和错误归一化的 API 客户端。
 *
 * @param options - Axios 默认配置及可选的现有 Axios 实例。
 * @returns 可发送类型安全请求的 API 客户端。
 */
export function createApiClient(options: CreateApiClientOptions = {}): ApiClient {
  const { axiosInstance, ...axiosOptions } = options;
  const instance = axiosInstance ?? axios.create(axiosOptions);

  /**
   * 发送请求并校验统一响应信封及其中的数据。
   *
   * @param config - Axios 请求配置。
   * @param dataSchema - 用于校验响应数据的 Zod Schema。
   * @returns Schema 校验后的响应数据。
   * @throws {@link ApiError} 当请求失败或响应不符合约定时抛出。
   */
  async function request<TSchema extends z.ZodType>(config: AxiosRequestConfig, dataSchema: TSchema): Promise<z.output<TSchema>> {
    try {
      const response = await instance.request<unknown>(config);
      const envelopeResult = respondDataSchema.safeParse(response.data);

      if (!envelopeResult.success) {
        throw new ApiError('服务响应格式不正确', {
          kind: 'protocol',
          details: envelopeResult.error.flatten(),
        });
      }

      const envelope = envelopeResult.data;
      if (envelope.code !== SUCCESS_CODE) {
        throw new ApiError(envelope.message, {
          kind: 'business',
          code: envelope.code,
          details: envelope.data,
          status: response.status,
        });
      }

      const dataResult = dataSchema.safeParse(envelope.data);
      if (!dataResult.success) {
        throw new ApiError('服务响应数据不符合约定', {
          kind: 'protocol',
          details: dataResult.error.flatten(),
          status: response.status,
        });
      }

      return dataResult.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  }

  return {
    request,
    get: (url, dataSchema, config) => request({ ...config, method: 'GET', url }, dataSchema),
    post: (url, dataSchema, data, config) => request({ ...config, method: 'POST', url, data }, dataSchema),
    patch: (url, dataSchema, data, config) => request({ ...config, method: 'PATCH', url, data }, dataSchema),
    delete: (url, dataSchema, config) => request({ ...config, method: 'DELETE', url }, dataSchema),
    requestRaw: async <TData>(config: AxiosRequestConfig) => {
      try {
        const response = await instance.request<TData>(config);
        return response.data;
      } catch (error) {
        throw normalizeApiError(error);
      }
    },
  };
}
