import { clsx, type ClassValue } from 'clsx'
import { format, isValid, parse } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export const DATE_FORMAT = 'dd/MM/yyyy'
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm:ss'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, pattern?: string) {
  if (!date || !isValid(date)) return ''
  return format(date, pattern || DATE_FORMAT)
}

export function parseDate(value?: string, pattern?: string): Date | undefined {
  if (!value || typeof value !== 'string') return undefined
  const parsed = parse(value, pattern || DATE_FORMAT, new Date())
  if (!isValid(parsed)) {
    if (import.meta.env.DEV) {
      console.warn(
        `[ParseError] Invalid date format: "${value}". Expected "${pattern || DATE_FORMAT}"`,
      )
    }
    return undefined
  }
  return parsed
}

export function getFieldError(errors: unknown[]): string {
  return errors.length > 0 ? String(errors[0]) : ''
}
