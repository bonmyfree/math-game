import type { DepartmentBlockData } from '@/features/system/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: DepartmentBlockData) {
  return row.PK_VPBS_BUSINESS ?? row.C_CODE
}

export function blockCode(row: DepartmentBlockData) {
  return formatCellValue(row.C_CODE)
}

export function blockName(row: DepartmentBlockData) {
  return formatCellValue(row.C_NAME)
}
