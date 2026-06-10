/**
 * AUTH API
 * Chỉ định nghĩa endpoint, không xử lý logic
 */

import type { BackUserData } from '@/features/system/services/system.types'
import { CMD, GROUP } from '@/shared/constants'
import { apiService } from '@/shared/services/api.service'
import { LoginPayload, LoginResponse } from '@/shared/types'
import type { ApiResponse, UserPermissionItem } from '@/shared/types/api.types'

export const authApi = {
  login: (payload: LoginPayload) => apiService.post<LoginResponse>('/backLogin', payload),

  getUserPermissions: (username: string) =>
    apiService.command<UserPermissionItem[]>('BACK.GET_SINGLE_USER_FUNC', GROUP.LIST, {
      ITEM_ID: username,
    }),

  getCurrentUser: (loginCode: string) =>
    apiService.command<BackUserData[], { ITEM_ID: string }>(CMD.GET_SINGLE_USER, GROUP.LIST, {
      ITEM_ID: loginCode,
    }),

  logout: () => apiService.command('BACK.LOGOUT', GROUP.EXEC, {}),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiService.post<ApiResponse<null>>('/auth/change-password', data),
}
