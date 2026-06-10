/**
 * AUTH STORE
 * Lưu: accessToken, refreshToken, user, session, permissions,
 * accessTokenExpiresAt (epoch ms), tokenExpiresIn (expires_in từ login, ms).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { tokenProvider } from '@/shared/services/tokenProvider'
import type { UserPermissions } from '@/shared/types/permission.types'
import {
  computeAccessTokenExpiresAtMs,
  FALLBACK_ACCESS_TTL_MS,
  getJwtExpMs,
  sessionFromAccessToken,
} from '@/shared/utils/tokenExpiry'

import { AUTH_STORE } from '../constants/auth'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  role: string // data[0][':B1']
  userName: string // data[0].C_USER_NAME
  loginTime: string // data[0].C_LOGIN_TIME
  session: string
  avatar?: string
  email?: string
}

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  /** Epoch ms — access token hết hiệu lực (từ JWT `exp` hoặc login `expires_in`). */
  accessTokenExpiresAt: number | null
  /** Giá trị `expires_in` gần nhất từ API login (ms theo BE). */
  tokenExpiresIn: number | null
  user: AuthUser | null
  permissions: UserPermissions
  isAuthenticated: boolean
  isLoading: boolean
  isLoadingPermissions: boolean
  error: string | null
}

type AuthActions = {
  loginStart: () => void
  loginSuccess: (payload: {
    accessToken: string
    refreshToken: string
    expiresIn?: number | null
    user: Omit<AuthUser, 'session'> // session tự extract từ JWT
  }) => void
  /** Sau refresh token — cập nhật JWT + session trong user, giữ user/permissions. */
  applyRefreshedTokens: (payload: { accessToken: string; refreshToken?: string | null }) => void
  loginFailure: (error: string) => void
  setPermissions: (permissions: UserPermissions) => void
  setLoadingPermissions: (isLoading: boolean) => void
  clearAuth: () => void
}

// ─── Dev bypass ───────────────────────────────────────────────────────────────
const DEV_BYPASS_AUTH = import.meta.env.DEV

const devBypassState: Partial<AuthState> = {
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh',
  // +365 ngày tính bằng ms: 365 * 24 * 60 * 60 * 1000
  accessTokenExpiresAt: Date.now() + 31536000000,
  tokenExpiresIn: 60000,
  user: {
    role: 'admin',
    userName: 'Admintrator',
    loginTime: '23/04/2026 18:21:54',
    session: 'mock-session',
  },
  isAuthenticated: true,
  permissions: {
    '0000000': ['view'],
    '0030002': ['view', 'update'],
    '0030003': ['view', 'update'],
    // '0010000': ['view'],
    // '0010001': ['view', 'update'],
    // '0010002': ['view'],
    // '0010003': ['view', 'update'],
    // '0020000': ['view'],
    // '0030000': ['view', 'update'],
    // '0030001': ['view', 'update'],
    // '0030002': ['view', 'update'],
  },
}

// ─── Initial state ────────────────────────────────────────────────────────────
const baseInitialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  tokenExpiresIn: null,
  user: null,
  permissions: {},
  isAuthenticated: false,
  isLoading: false,
  isLoadingPermissions: false,
  error: null,
}

const initialState: AuthState = {
  ...baseInitialState,
  ...(DEV_BYPASS_AUTH ? devBypassState : {}),
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      ...initialState,

      // Action
      loginStart: () => set({ isLoading: true, error: null }),

      loginSuccess: ({ accessToken, refreshToken, expiresIn, user }) => {
        const session = sessionFromAccessToken(accessToken)
        const accessTokenExpiresAt = computeAccessTokenExpiresAtMs(accessToken, expiresIn)
        tokenProvider.set({ accessToken, refreshToken })
        set({
          accessToken,
          refreshToken,
          accessTokenExpiresAt,
          tokenExpiresIn: expiresIn ?? null,
          user: { ...user, session },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },

      applyRefreshedTokens: ({ accessToken, refreshToken: newRt }) => {
        set((state) => {
          const session = sessionFromAccessToken(accessToken)
          const nextRefresh = newRt ?? state.refreshToken
          const accessTokenExpiresAt =
            getJwtExpMs(accessToken) ??
            state.accessTokenExpiresAt ??
            Date.now() + FALLBACK_ACCESS_TTL_MS
          tokenProvider.set({ accessToken, refreshToken: nextRefresh })
          return {
            accessToken,
            refreshToken: nextRefresh,
            accessTokenExpiresAt,
            user: state.user ? { ...state.user, session } : state.user,
          }
        })
      },

      loginFailure: (error) => set({ isLoading: false, error, isAuthenticated: false }),

      setPermissions: (permissions) => set({ permissions, isLoadingPermissions: false }),

      setLoadingPermissions: (isLoading) => set({ isLoadingPermissions: isLoading }),

      clearAuth: () => {
        tokenProvider.clear()
        set(baseInitialState)
      },
    }),
    {
      name: AUTH_STORE,
      // Chỉ persist những field cần thiết — isLoading, error không cần persist.
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        accessTokenExpiresAt: s.accessTokenExpiresAt,
        tokenExpiresIn: s.tokenExpiresIn,
        user: s.user,
        permissions: s.permissions,
        isAuthenticated: s.isAuthenticated,
      }),
      // Sau khi rehydrate xong, bơm token vào provider để api.service đọc được.
      onRehydrateStorage: () => (state) => {
        if (state) {
          tokenProvider.set({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          })
        }
      },
    },
  ),
)

// Trailing sync: phủ trường hợp persist sync (không có gì để rehydrate) hoặc
// đang ở DEV bypass (initialState đã có 'mock-token').
const _initial = useAuthStore.getState()
tokenProvider.set({
  accessToken: _initial.accessToken,
  refreshToken: _initial.refreshToken,
})

useAuthStore.persist.onFinishHydration(() => {
  const { accessToken, accessTokenExpiresAt } = useAuthStore.getState()
  if (!accessToken || accessTokenExpiresAt != null) return
  const ms = getJwtExpMs(accessToken)
  if (ms != null) useAuthStore.setState({ accessTokenExpiresAt: ms })
})
