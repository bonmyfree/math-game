import { format, isValid, parse } from 'date-fns'

import { DATE_FORMAT, DATETIME_FORMAT } from '@/shared/utils/utils'

import type { CellContext } from '@tanstack/react-table'

const API_DATE_PATTERNS = [
  'yyyy-MM-dd HH:mm:ss',
  "yyyy-MM-dd'T'HH:mm:ss",
  'yyyy-MM-dd',
  'dd/MM/yyyy  HH:mm:ss',
  'dd/MM/yyyy HH:mm:ss',
  'dd/MM/yyyy',
]

/** Giá trị hiển thị trong ô bảng — rỗng thì trả chuỗi rỗng (không dùng ? / —). */
export function formatCellValue(value: unknown): string {
  if (value == null || value === '') return ''
  const str = String(value).trim()
  return str === '' ? '' : String(value)
}

export function formatApiDate(value: unknown, pattern = DATE_FORMAT): string {
  if (value == null || value === '') return ''
  const str = String(value).trim()
  for (const p of API_DATE_PATTERNS) {
    const d = parse(str, p, new Date())
    if (isValid(d)) return format(d, pattern)
  }
  const d = new Date(str)
  if (isValid(d)) return format(d, pattern)
  return str
}

export function formatApiDateTime(value: unknown): string {
  return formatApiDate(value, DATETIME_FORMAT)
}

export function formatFileSize(value: unknown): string {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function dateCell<T>(pattern = DATE_FORMAT) {
  function DateCell(info: CellContext<T, unknown>) {
    const text = formatApiDate(info.getValue(), pattern)
    if (!text) return null
    return <span>{text}</span>
  }
  return DateCell
}

export function dateTimeCell<T>() {
  function DateTimeCell(info: CellContext<T, unknown>) {
    const text = formatApiDateTime(info.getValue())
    if (!text) return null
    return <span>{text}</span>
  }
  return DateTimeCell
}

export function textCell<T>(info: CellContext<T, unknown>) {
  const text = formatCellValue(info.getValue())
  if (!text) return null
  return <span>{text}</span>
}

export function lineClampTextCell<T>(className = 'line-clamp-2') {
  function LineClampTextCell(info: CellContext<T, unknown>) {
    const text = formatCellValue(info.getValue())
    if (!text) return null
    return <span className={className}>{text}</span>
  }
  return LineClampTextCell
}

export function fileSizeCell<T>(info: CellContext<T, unknown>) {
  const text = formatFileSize(info.getValue())
  if (!text) return null
  return <span>{text}</span>
}

/** Ô bảng lấy text từ hàm theo `row.original`. */
export function rowTextCell<T>(getText: (row: T) => unknown, className?: string) {
  function RowTextCell({ row }: { row: { original: T } }) {
    const text = formatCellValue(getText(row.original))
    if (!text) return null
    return className ? <span className={className}>{text}</span> : <span>{text}</span>
  }
  return RowTextCell
}

export function statusCell(value: unknown, activeLabel: string, inactiveLabel: string) {
  const v = Number(value)
  return <span>{v === 1 ? activeLabel : inactiveLabel}</span>
}
