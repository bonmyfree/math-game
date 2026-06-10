import { ApiResponse } from './api.types'

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface LoginPayload {
  user: string
  pass: string
}

// ─── Login ────────────────────────────────────────────────────────────────────
// Một bản ghi trong `data` của response /backLogin.
export interface LoginUserData {
  C_LOGIN_TIME: string // "23/04/2026 18:21:54"
  C_USER_NAME: string // "Admintrator"
  ':B1': string // "admin" — username
}

export interface LoginToken {
  accessToken: string
  refreshToken: string
  token_type: string // "Bearer"
  expires_in: number // TTL access token do BE trả (thường là ms); client ưu tiên claim `exp` trong JWT nếu có
}

/**
 * Response của /backLogin.
 * data: LoginUserData[] (backend luôn wrap rows trong mảng)
 * token: required — chỉ login mới có
 */
export interface LoginResponse extends ApiResponse<LoginUserData[]> {
  token: LoginToken
}

/**
 * Hồ sơ người dùng hiển thị sau khi login (dùng cho store + UI auth).
 * KHÔNG dùng cho User Management entity.
 */
export interface LoginUser {
  role: string
  userName: string
  loginTime: string
  avatar?: string
  email?: string
}

/**
 * Entity người dùng cho User Management.
 */
export interface UserInfo {
  id: string
  username: string
  email: string
  fullName: string
  avatar?: string
  role: string
  status?: 'active' | 'inactive'
}

export function mapUser(res: LoginUserData): LoginUser {
  return {
    loginTime: res.C_LOGIN_TIME,
    userName: res.C_USER_NAME,
    role: res[':B1'],
  }
}
