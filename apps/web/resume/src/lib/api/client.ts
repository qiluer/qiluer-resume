import { createApiClient, createUserAuthApi } from '@qiluer-resume/api-client';

export const apiClient = createApiClient({
  baseURL: '/api',
  timeout: 5000,
  withCredentials: true,
});

export const userAuthApi = createUserAuthApi(apiClient);
