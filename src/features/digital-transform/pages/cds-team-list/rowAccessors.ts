import type { CdsTeamData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsTeamData) {
  return row.PK_TEAM
}

export function teamName(row: CdsTeamData) {
  return formatCellValue(row.C_TEAM_NAME)
}

export function teamDisplayName(row: CdsTeamData) {
  return teamName(row) || row.PK_TEAM
}

export function leaderLabel(row: CdsTeamData) {
  return formatCellValue(row.C_LEADER_NAME ?? row.C_LEADER)
}

export function companyLabel(row: CdsTeamData) {
  return formatCellValue(row.C_COMPANY_NAME ?? row.C_COMPANY)
}
