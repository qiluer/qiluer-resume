import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@features/auth/types';

export type AuthStatus = 'idle' | 'loading' | 'authed';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: AuthStatus;

  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  setStatus: (status: AuthStatus) => void;

  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      status: 'idle',

      setAuth: (token, user) =>
        set({
          token,
          user,
          status: 'authed',
        }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          status: 'idle',
        }),

      setStatus: (status) => set({ status }),

      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'qiluer-resume-auth',
      storage: createJSONStorage(() => localStorage),
      // 仅持久化 token 与 user，状态由运行时计算
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
