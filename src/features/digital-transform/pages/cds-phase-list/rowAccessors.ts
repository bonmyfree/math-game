import type { CdsPhaseData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsPhaseData) {
  return row.PK_PHASE
}

export function phaseName(row: CdsPhaseData) {
  return formatCellValue(row.C_PHASE_NAME ?? row.C_NAME)
}

export function phaseProject(row: CdsPhaseData) {
  return formatCellValue(row.C_PROJECT_NAME ?? row.C_PROJECT_CODE)
}

export function phaseCode(row: CdsPhaseData) {
  return formatCellValue(row.C_PHASE_CODE ?? row.C_CODE)
}

export function phaseDescription(row: CdsPhaseData) {
  return formatCellValue(row.C_DESCRIPTION ?? row.C_NOTE)
}
