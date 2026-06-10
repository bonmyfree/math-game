import type { CdsFeatureData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsFeatureData) {
  return row.PK_FEATURE
}

export function featureName(row: CdsFeatureData) {
  return formatCellValue(row.C_FEATURE_NAME ?? row.C_NAME)
}

export function projectLabel(row: CdsFeatureData) {
  return formatCellValue(row.C_PROJECT_NAME)
}

export function phaseLabel(row: CdsFeatureData) {
  return formatCellValue(row.C_PHASE_NAME)
}

export function pmLabel(row: CdsFeatureData) {
  return formatCellValue(row.C_PM_NAME ?? row.C_PM)
}

export function priorityLabel(row: CdsFeatureData) {
  return formatCellValue(row.C_PRIORITY)
}
