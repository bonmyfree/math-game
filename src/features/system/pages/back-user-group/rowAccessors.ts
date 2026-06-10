import type { BackUserGroupData } from '@/features/system/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: BackUserGroupData) {
  return row.PK_USER_GROUP
}

export function groupCode(row: BackUserGroupData) {
  return formatCellValue(row.C_USER_GROUP_CODE)
}

export function groupName(row: BackUserGroupData) {
  return formatCellValue(row.C_USER_GROUP_NAME)
}

export function groupDisplayName(row: BackUserGroupData) {
  return groupName(row) || groupCode(row) || rowId(row)
}
