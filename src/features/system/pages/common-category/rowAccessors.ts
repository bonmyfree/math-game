import type { CommonCategoryData } from '@/features/system/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CommonCategoryData) {
  return row.PK_LISTTYPE
}

export function categoryCode(row: CommonCategoryData) {
  return formatCellValue(row.C_CODE)
}

export function categoryName(row: CommonCategoryData) {
  return formatCellValue(row.C_NAME)
}

export function categoryDisplayLabel(row: CommonCategoryData) {
  return categoryCode(row) || rowId(row)
}
