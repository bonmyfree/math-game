import type { CdsProjectData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsProjectData) {
  return row.PK_PROJECT
}

export function projectName(row: CdsProjectData) {
  return formatCellValue(row.C_PROJECT_NAME ?? row.C_NAME)
}

export function projectCompany(row: CdsProjectData) {
  return formatCellValue(row.C_COMPANY_NAME ?? row.C_COMPANY)
}

export function projectPm(row: CdsProjectData) {
  return formatCellValue(row.C_PM_NAME ?? row.C_PM)
}

export function projectDescription(row: CdsProjectData) {
  return formatCellValue(row.C_DESCRIPTION ?? row.C_NOTE)
}
