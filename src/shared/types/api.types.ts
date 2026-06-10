import { LoginToken } from './auth.types'

// ─── API Types ───────────────────────────────────────────────────────
/**
 * Wrapper chuẩn cho mọi response dạng JSON từ backend.
 *
 * `T` là KIỂU CỦA TRƯỜNG `data` (đã unwrap khỏi Axios response).
 *  - List endpoint  ->  ApiResponse<UserInfo[]>          (data: UserInfo[])
 *  - Item endpoint  ->  ApiResponse<UserInfo>            (data: UserInfo)
 *  - Empty endpoint ->  ApiResponse<null>                (data: null)
 *  - Login endpoint ->  LoginResponse (extends ApiResponse<LoginUserData[]> + { token })
 */
export interface ApiResponse<T = unknown> {
  data: T
  sRs: string | null
  iRc: number
  message?: string
  code?: number
  success?: boolean
  // Chỉ tồn tại trên login response. Optional ở lớp chung để consumers không phải else-branch.
  token?: LoginToken
}

export interface ApiError {
  code: number
  message: string
  success: false
  data: null
  details?: unknown
}

// ─── Command request payload ──────────────────────────────────────────────────
export interface CommandRequest<T = unknown> {
  user: string
  session: string
  cmd: string
  group: string
  data: T
}

// ─── User permissions ─────────────────────────────────────────────────────────
// cmd: BACK.GET_SINGLE_USER_FUNC  →  { ITEM_ID: username }
export interface UserPermissionItem {
  C_FUNCTION_CODE: string // "0010001"
  C_VIEW: number // 0 | 1
  C_UPDATE: number // 0 | 1
  C_APPROVE: number // 0 | 1
}

// Backend trả về danh sách permission rows -> data là MẢNG.
export type UserPermissionsResponse = ApiResponse<UserPermissionItem[]>

export type PaginationData = {
  RECORD_PER_PAGE: number
  PAGE: number
}
