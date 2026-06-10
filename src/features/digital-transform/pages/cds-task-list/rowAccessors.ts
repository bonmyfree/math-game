import type { CdsTaskData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsTaskData) {
  return row.PK_TASK
}

export function taskDisplayName(row: CdsTaskData) {
  return formatCellValue(row.C_JIRA_KEY) || row.PK_TASK
}

export function taskDescription(row: CdsTaskData) {
  return formatCellValue(row.C_DESCRIPTION ?? row.C_NOTE)
}
