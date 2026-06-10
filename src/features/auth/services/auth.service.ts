/**
 * AUTH SERVICE: Xử lý luồng logic
 * Business logic: flow login, load permissions, logout...
 * Dùng authApi để gọi HTTP, useAuthStore để quản lý state
 *
 * Quy ước:
 * - login: success -> trả về LoginResponse; failure -> throw Error
 *   (không tự toast; caller có thể bọc qua submitWithToast để hiển thị)
 */

import i18n from '@/shared/i18n'
import { toastService } from '@/shared/services/toast.service'
import { useAuthStore } from '@/shared/stores'
import { LoginPayload, LoginResponse, mapUser, UserPermissionsResponse } from '@/shared/types'

import { authApi } from './auth.api'
import { mapPermissions } from '../utils/permission.util'

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const store = useAuthStore.getState()
    store.loginStart()

    try {
      const res = await authApi.login(payload)

      if (res.iRc !== 1) {
        const msg = res.sRs || i18n.t('toast.loginFailed')
        store.loginFailure(msg)
        throw new Error(msg)
      }

      const userData = mapUser(res.data[0])
      const { accessToken, refreshToken, expires_in: expiresIn } = res.token

      store.loginSuccess({
        accessToken,
        refreshToken,
        expiresIn,
        user: userData,
      })

      await authService.loadPermissions(userData.role)

      return res
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? i18n.t('toast.loginFailed')
      const state = useAuthStore.getState()
      if (state.isLoading) state.loginFailure(msg)
      throw err instanceof Error ? err : new Error(msg)
    }
  },

  loadPermissions: async (username: string): Promise<void> => {
    const store = useAuthStore.getState()
    store.setLoadingPermissions(true)

    try {
      const res: UserPermissionsResponse = await authApi.getUserPermissions(username)

      if (res.iRc === 1 && Array.isArray(res.data)) {
        const permissions = mapPermissions(res.data)
        store.setPermissions(permissions)
      } else {
        console.warn('[Auth] Load permissions failed:', res.sRs)
        store.setLoadingPermissions(false)
      }
    } catch (error) {
      console.warn('[Auth] Load permissions error:', error)
      store.setLoadingPermissions(false)
    }
  },

  logout: async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch {
      // Luôn clear local state dù API lỗi
    } finally {
      useAuthStore.getState().clearAuth()
      toastService.info(i18n.t('toast.logoutSuccess'))
    }
  },
}
