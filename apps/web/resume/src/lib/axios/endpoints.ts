// API 端点常量 — 集中维护，避免散落字符串
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  user: {
    list: '/user/list',
    create: '/user/create',
  },
} as const;
