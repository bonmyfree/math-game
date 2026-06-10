import type { CdsFrontGroupData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsFrontGroupData) {
  return row.PK_USER_GROUP
}

export function groupCode(row: CdsFrontGroupData) {
  return formatCellValue(row.C_USER_GROUP_CODE)
}

export function groupName(row: CdsFrontGroupData) {
  return formatCellValue(row.C_USER_GROUP_NAME)
}
