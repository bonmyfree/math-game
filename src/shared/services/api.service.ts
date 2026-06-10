/**
 * BASE API SERVICE
 * ─────────────────────────────────────────────────────────────────────────────
 * Hỗ trợ 2 pattern song song:
 *
 * 1) REST verbs — get / post / put / patch / delete
 *    Trả về RAW response body (đã unwrap khỏi Axios).
 *
 * 2) Command pattern — POST /backServices  { user, session, cmd, group, data }
 *
 * Request: nếu `accessTokenExpiresAt` trong store đã gần / quá hạn → gọi refresh (chung refreshPromise),
 *   không còn refresh token → `forceLogout()`.
 * 401 (có refreshToken, không phải endpoint login/refresh):
 *   Mọi request đồng thời dùng chung một `refreshPromise` — gọi một lần
 *   POST `VITE_AUTH_REFRESH_PATH` (mặc định `/auth/refresh`) qua axios tách
 *   (không interceptor), `applyRefreshedTokens`, rồi retry request gốc.
 *   Refresh thất bại hoặc retry vẫn 401 → `forceLogout()`.
 *
 * Response bị trình duyệt chặn (CORS sai, v.v.): không có `error.response` nhưng Network vẫn thấy 401 —
 * Axios thường `ERR_NETWORK` / "Network Error". Nếu đã đăng nhập (có token) và không phải URL login/refresh
 * → `forceLogout()` + redirect `/login` (trade-off: mất mạng tạm cũng có thể logout).
 */

import axios, {
  AxiosRequestConfig,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

import { router } from '@/app/router'
import type { ApiGroup } from '@/shared/constants'
import { tokenProvider } from '@/shared/services/tokenProvider'
import { useAuthStore } from '@/shared/stores/auth.store'
import type { ApiError, ApiResponse, CommandRequest } from '@/shared/types/api.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const REFRESH_PATH = import.meta.env.VITE_AUTH_REFRESH_PATH ?? '/auth/refresh'

/** Làm mới access token trước khi hết hạn (ms). */
const ACCESS_TOKEN_EXPIRY_SKEW_MS = 5000
const SESSION_EXPIRED_MSG = 'Session expired'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const refreshAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshPromise: Promise<string> | null = null

function forceLogout(): void {
  useAuthStore.getState().clearAuth()
  if (router.state.location.pathname !== '/login') {
    void router.navigate({ to: '/login', replace: true })
  }
}

function rejectHttpError(status: number | undefined, message: string): Promise<never> {
  if (typeof status === 'number' && Number.isFinite(status)) {
    const err: ApiError = {
      code: status,
      message,
      success: false,
      data: null,
    }
    return Promise.reject(err)
  }
  return Promise.reject({ message })
}

function pathOnly(config: InternalAxiosRequestConfig): string {
  const u = config.url ?? ''
  if (u.startsWith('http://') || u.startsWith('https://')) {
    try {
      return new URL(u).pathname
    } catch {
      return u.split('?')[0] || u
    }
  }
  return u.split('?')[0] || u || '/'
}

function shouldSkipTokenRefresh(config: InternalAxiosRequestConfig): boolean {
  const p = pathOnly(config)
  return (
    p === '/backLogin' ||
    p.endsWith('/backLogin') ||
    p === '/login' ||
    p.endsWith('/login') ||
    p === REFRESH_PATH ||
    p.endsWith(REFRESH_PATH)
  )
}

function logoutAndReject401(message: string = SESSION_EXPIRED_MSG): Promise<never> {
  forceLogout()
  return rejectHttpError(401, message)
}

function shouldProactiveRefreshAccessToken(config: InternalAxiosRequestConfig): boolean {
  const { isAuthenticated, accessTokenExpiresAt: exp } = useAuthStore.getState()
  return (
    isAuthenticated &&
    exp != null &&
    Date.now() >= exp - ACCESS_TOKEN_EXPIRY_SKEW_MS &&
    !shouldSkipTokenRefresh(config)
  )
}

/** Không có response body trong JS (hay gặp khi CORS lỗi) — coi như phiên không hợp lệ và đưa về login. */
function shouldLogoutWhenResponseBlocked(
  error: unknown,
  config: InternalAxiosRequestConfig,
): boolean {
  if (!axios.isAxiosError(error)) return false
  if (error.response != null) return false
  if (error.code === 'ERR_CANCELED') return false
  if (shouldSkipTokenRefresh(config)) return false
  const { isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated || !tokenProvider.getAccessToken()) return false
  return error.code === 'ERR_NETWORK' || error.message === 'Network Error'
}

function parseRefreshBody(
  data: unknown,
): { accessToken: string; refreshToken?: string | null } | null {
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>

  if (typeof d.accessToken === 'string') {
    return {
      accessToken: d.accessToken,
      refreshToken: typeof d.refreshToken === 'string' ? d.refreshToken : undefined,
    }
  }

  if (d.token && typeof d.token === 'object') {
    const t = d.token as Record<string, unknown>
    if (typeof t.accessToken === 'string') {
      return {
        accessToken: t.accessToken,
        refreshToken: typeof t.refreshToken === 'string' ? t.refreshToken : undefined,
      }
    }
  }

  if (d.iRc === 1 && d.data != null) {
    const raw = d.data
    const inner = Array.isArray(raw)
      ? (raw[0] as Record<string, unknown> | undefined)
      : (raw as Record<string, unknown>)
    if (inner && typeof inner === 'object' && typeof inner.accessToken === 'string') {
      return {
        accessToken: inner.accessToken,
        refreshToken: typeof inner.refreshToken === 'string' ? inner.refreshToken : undefined,
      }
    }
  }

  return null
}

async function fetchRefreshedTokens(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken?: string | null }> {
  const { data } = await refreshAxios.post<unknown>(REFRESH_PATH, { refreshToken })
  const parsed = parseRefreshBody(data)
  if (!parsed?.accessToken) throw new Error('Invalid refresh response')
  return parsed
}

function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise

  const rt = useAuthStore.getState().refreshToken
  if (!rt) return Promise.reject(new Error('No refresh token'))

  refreshPromise = fetchRefreshedTokens(rt)
    .then((tokens) => {
      useAuthStore.getState().applyRefreshedTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
      return tokens.accessToken
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

// ─── Request interceptor — gắn Bearer token ──────────────────────────────────
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (shouldProactiveRefreshAccessToken(config)) {
      if (!useAuthStore.getState().refreshToken) {
        return logoutAndReject401()
      }
      try {
        await refreshAccessToken()
      } catch {
        return logoutAndReject401()
      }
    }

    const token = tokenProvider.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: {
    response?: { status?: number; data?: { sRs?: string } }
    config?: RetryConfig
    message?: string
  }) => {
    const originalRequest = error.config
    const status = error.response?.status
    const msg = error.response?.data?.sRs || error.message || 'Lỗi không xác định'

    // Trước đây: (status !== 401 || !originalRequest) → 401 nhưng mất `config` thì không logout.
    if (status === 401 && !originalRequest) {
      forceLogout()
      return rejectHttpError(401, msg)
    }

    if (status !== 401 || !originalRequest) {
      if (
        status === undefined &&
        originalRequest &&
        shouldLogoutWhenResponseBlocked(error, originalRequest)
      ) {
        forceLogout()
        return rejectHttpError(401, msg)
      }
      return rejectHttpError(status, msg)
    }

    if (shouldSkipTokenRefresh(originalRequest)) {
      forceLogout()
      return rejectHttpError(401, msg)
    }

    if (!useAuthStore.getState().refreshToken) {
      forceLogout()
      return rejectHttpError(401, msg)
    }

    if (originalRequest._retry) {
      return logoutAndReject401()
    }

    originalRequest._retry = true

    try {
      const token = await refreshAccessToken()
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${token}`
      return axiosInstance.request(originalRequest)
    } catch {
      return logoutAndReject401()
    }
  },
)

export const apiService = {
  async get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    const res = await axiosInstance.get<TResponse>(url, config)
    return res.data
  },

  async post<TResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await axiosInstance.post<TResponse>(url, data, config)
    return res.data
  },

  async put<TResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await axiosInstance.put<TResponse>(url, data, config)
    return res.data
  },

  async patch<TResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await axiosInstance.patch<TResponse>(url, data, config)
    return res.data
  },

  async delete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    const res = await axiosInstance.delete<TResponse>(url, config)
    return res.data
  },

  /**
   * @TPayload Datatype của payload data
   * @TData Datatype của response data
   * @param cmd
   * @param group
   * @param data
   * @param url
   * @returns
   */
  async command<TData = unknown, TPayload = unknown>(
    cmd: string,
    group: ApiGroup,
    data: TPayload = {} as TPayload,
    url = '/backServices',
  ): Promise<ApiResponse<TData>> {
    const authUser = useAuthStore.getState().user
    const payload: CommandRequest<TPayload> = {
      user: authUser?.role ?? '',
      session: authUser?.session ?? '',
      cmd,
      group,
      data,
    }
    const res = await axiosInstance.post<ApiResponse<TData>>(url, payload)
    return res.data
  },
}
