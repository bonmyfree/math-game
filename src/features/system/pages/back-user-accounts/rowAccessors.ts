import type { BackUserData } from '@/features/system/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: BackUserData) {
  return row.PK_USER
}

export function loginCode(row: BackUserData) {
  return formatCellValue(row.C_BACK_USER_CODE)
}

export function userName(row: BackUserData) {
  return formatCellValue(row.C_USER_NAME)
}

export function deleteConfirmCode(row: BackUserData) {
  return loginCode(row) || rowId(row)
}
