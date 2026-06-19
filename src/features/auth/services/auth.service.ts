/**
 * AUTH SERVICE: Xử lý luồng logic xác thực
 *
 * TẠM THỜI: login được hardcode (admin / 123456) — KHÔNG gọi API.
 * Khi có backend thật, thay phần kiểm tra hardcode bằng authApi.login.
 */

import i18n from '@/shared/i18n'
import { toastService } from '@/shared/services/toast.service'
import { useAuthStore } from '@/shared/stores'
import type { LoginPayload } from '@/shared/types'
import type { UserPermissions } from '@/shared/types/permission.types'

// ─── Thông tin đăng nhập hardcode ──────────────────────────────────────────────
const HARDCODED_CREDENTIALS = { user: 'admin', pass: '123456' }

// +365 ngày tính bằng ms
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

const HARDCODED_PERMISSIONS: UserPermissions = {
  '0000000': ['view'],
  '0030002': ['view', 'update'],
  '0030003': ['view', 'update'],
}

export const authService = {
  /**
   * Login tạm hardcode admin/123456 — không gọi API.
   * Trả về `{ iRc: 1 }` để submitWithToast nhận diện success; throw Error khi sai.
   */
  login: async (payload: LoginPayload): Promise<{ iRc: number }> => {
    const store = useAuthStore.getState()
    store.loginStart()

    const valid =
      payload.user === HARDCODED_CREDENTIALS.user && payload.pass === HARDCODED_CREDENTIALS.pass

    if (!valid) {
      const msg = i18n.t('toast.loginFailed')
      store.loginFailure(msg)
      throw new Error(msg)
    }

    store.loginSuccess({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      expiresIn: ONE_YEAR_MS,
      user: {
        role: 'admin',
        userName: 'Admin',
        loginTime: '',
      },
    })
    store.setPermissions(HARDCODED_PERMISSIONS)

    return { iRc: 1 }
  },

  logout: async (): Promise<void> => {
    useAuthStore.getState().clearAuth()
    toastService.info(i18n.t('toast.logoutSuccess'))
  },
}
