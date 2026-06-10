import { toastService } from '@/shared/services/toast.service'

import type { UseMutationResult } from '@tanstack/react-query'
import type { TFunction } from 'i18next'

/**
 * Bọc một `mutateAsync` của TanStack Query bằng try/catch + toast.
 *
 * Quy ước phán đoán success/failure trên giá trị trả về:
 *   1. Throw       -> toast error theo `error.message` (hoặc errorMessageKey).
 *   2. Falsy       -> toast error generic.
 *   3. ApiResponse-shape (có `iRc: number`)
 *        - iRc === 1  -> success
 *        - iRc !== 1  -> error, ưu tiên dùng `sRs` làm message
 *      (kể cả khi BE trả HTTP 200 với iRc=0 thì vẫn được coi là failure.)
 *   4. Khác (boolean true / object không có iRc) -> success.
 *
 * Trả về discriminated union `{ ok: true, res } | { ok: false, res?, err? }`
 * để caller branch sạch.
 */

export type SubmitResult<TData> =
  | { ok: true; res: TData }
  | { ok: false; res?: TData; err?: unknown }

type ApiResponseLike = {
  iRc?: unknown
  sRs?: unknown
  message?: unknown
  success?: unknown
}

function asApiResponseLike(value: unknown): ApiResponseLike | null {
  if (!value || typeof value !== 'object') return null
  return value as ApiResponseLike
}

function isApiSuccess(res: unknown): boolean {
  const obj = asApiResponseLike(res)
  if (!obj) return Boolean(res)
  if (typeof obj.iRc === 'number') return obj.iRc === 1
  if (obj.success === false) return false
  return true
}

function pickApiErrorMessage(res: unknown): string | undefined {
  const obj = asApiResponseLike(res)
  if (!obj) return undefined
  if (typeof obj.sRs === 'string' && obj.sRs.trim()) return obj.sRs
  if (typeof obj.message === 'string' && obj.message.trim()) return obj.message
  return undefined
}

export async function submitWithToast<TVars, TData>(
  mutateAsync: UseMutationResult<TData, unknown, TVars>['mutateAsync'],
  vars: TVars,
  t: TFunction,
  opts?: { successMessageKey?: string; errorMessageKey?: string },
): Promise<SubmitResult<TData>> {
  const fallbackError = t(opts?.errorMessageKey ?? 'toast.error')

  try {
    const res = await mutateAsync(vars)

    if (!res || !isApiSuccess(res)) {
      toastService.error(pickApiErrorMessage(res) || fallbackError)
      return { ok: false as const, res: res as TData | undefined }
    }

    if (opts?.successMessageKey) toastService.success(t(opts.successMessageKey))
    return { ok: true as const, res }
  } catch (err: unknown) {
    const msg = (err as { message?: string })?.message || fallbackError
    toastService.error(msg)
    return { ok: false as const, err }
  }
}
