import type { SystemLogData } from '@/features/system/services'

export function rowId(row: SystemLogData) {
  return row.PK_REQUEST_INFO ?? ''
}
