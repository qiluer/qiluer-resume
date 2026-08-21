import { createApiClient, createUserAuthApi } from '@qiluer-resume/api-client';

/** 面向后端 `/api` 路径的共享 HTTP 客户端。 */
export const apiClient = createApiClient({
  baseURL: '/api',
  timeout: 5000,
  withCredentials: true,
});

/** 基于共享 HTTP 客户端创建的用户认证 API。 */
export const userAuthApi = createUserAuthApi(apiClient);
