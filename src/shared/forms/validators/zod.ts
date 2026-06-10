import { z } from 'zod'

import type { TFunction } from 'i18next'

export type FormError = { path?: string; message: string; code?: string }

export function zodIssueToI18nKey(issue: z.ZodIssue) {
  return `form.errors.${issue.code}`
}

function isRequiredStringIssue(issue: z.ZodIssue, value: unknown) {
  const raw = issue as { type?: string; origin?: string; minimum?: number }
  const isStringIssue = raw.type === 'string' || raw.origin === 'string'
  return (
    issue.code === 'too_small' &&
    isStringIssue &&
    raw.minimum === 1 &&
    typeof value === 'string' &&
    value.trim().length === 0
  )
}

export function zodToFormErrors(err: z.ZodError, t: TFunction): FormError[] {
  return err.issues.map((issue) => {
    const i18nKey = zodIssueToI18nKey(issue)
    return {
      path: issue.path.join('.'),
      code: issue.code,
      message: t(i18nKey, { defaultValue: issue.message }),
    }
  })
}

export function zodFirstErrorMessage(schema: z.ZodTypeAny, value: unknown, t?: TFunction) {
  const parsed = schema.safeParse(value)
  if (parsed.success) return undefined

  const first = parsed.error.issues[0]
  if (!first) return 'Invalid value'
  if (!t) return first.message

  if (isRequiredStringIssue(first, value)) {
    return t('form.errors.required', { defaultValue: 'Truong khong duoc de trong' })
  }

  return t(zodIssueToI18nKey(first), { defaultValue: first.message })
}
