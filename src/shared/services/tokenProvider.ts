/**
 * TOKEN PROVIDER
 * ─────────────────────────────────────────────────────────────────────────────
 * Singleton trong-bộ-nhớ giữ cặp token hiện hành, dùng làm bridge giữa
 * `api.service` (request interceptor) và `auth.store` (source of truth).
 *
 * Lý do tách module:
 *   - `api.service` cần token cho mọi request, nhưng không nên import
 *     `useAuthStore` ở top-level (rủi ro circular + couple vào persist shape).
 *   - `auth.store` đăng ký token vào provider mỗi khi state thay đổi
 *     (login / logout / rehydrate).
 *
 * Provider KHÔNG đọc/ghi localStorage trực tiếp — chỉ giữ giá trị in-memory.
 * Persist được lo bởi `auth.store` (Zustand persist middleware).
 */

let _accessToken: string | null = null
let _refreshToken: string | null = null

export const tokenProvider = {
  getAccessToken(): string | null {
    return _accessToken
  },
  getRefreshToken(): string | null {
    return _refreshToken
  },
  set(tokens: { accessToken: string | null; refreshToken?: string | null }): void {
    _accessToken = tokens.accessToken
    if (tokens.refreshToken !== undefined) _refreshToken = tokens.refreshToken
  },
  clear(): void {
    _accessToken = null
    _refreshToken = null
  },
}
