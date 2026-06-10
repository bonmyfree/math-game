import type { CdsFrontUserData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsFrontUserData) {
  return row.PK_USER
}

export function fullName(row: CdsFrontUserData) {
  return formatCellValue(row.C_FULL_NAME)
}

export function userDisplayCode(row: CdsFrontUserData) {
  return formatCellValue(row.C_USER_NAME) || row.PK_USER
}

export function companyLabel(row: CdsFrontUserData) {
  return formatCellValue(row.C_COMPANY_NAME ?? row.C_COMPANY)
}
