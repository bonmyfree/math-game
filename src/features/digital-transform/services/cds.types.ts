import type { CodeNameListPayload } from '@/features/system/services'

/** GET_ALL_USER — Người dùng Front CĐS */
export type CdsFrontUserListPayload = CodeNameListPayload

export type CdsFrontUserData = {
  PK_USER: string
  ROW_NUM: number
  C_TOTAL_RECORD: number
  C_FULL_NAME?: string | null
  C_USER_NAME?: string | null
  C_ROLE?: string | null
  C_POSITION?: string | null
  C_EMAIL?: string | null
  C_COMPANY?: string | null
  C_COMPANY_NAME?: string | null
  C_CREATE_TIME?: string | null
  C_STATUS?: number | null
}

/** GET_ALL_USER_GROUP — Nhóm Front CĐS */
export type CdsFrontGroupListPayload = CodeNameListPayload & {
  ACTIVE: number
}

export type CdsFrontGroupData = {
  PK_USER_GROUP: string
  C_USER_GROUP_CODE: string
  C_USER_GROUP_NAME: string
  C_NOTE?: string | null
  C_STATUS: number
  C_CREATE_TIME?: string | null
  ROW_NUM: number
  C_TOTAL_RECORD: number
}

/** GET_ALL_TEAM */
export type CdsTeamListPayload = CodeNameListPayload

export type CdsTeamData = {
  PK_TEAM: string
  ROW_NUM: number
  C_TOTAL_RECORD: number
  C_TEAM_NAME?: string | null
  C_LEADER?: string | null
  C_LEADER_NAME?: string | null
  C_COMPANY?: string | null
  C_COMPANY_NAME?: string | null
}

/** LIST_FILE_UNDO (group DM) — Tài liệu đã xóa */
export type CdsDeletedDocListPayload = {
  PAGE: number
  RECORD_PER_PAGE: number
  FILTER: string
}

/** UNDO_FILE (group DM) — Khôi phục tài liệu */
export type CdsRestoreFilePayload = {
  LIST_ITEM_ID: string
}

export type CdsRestoreFileResult = {
  RS: string
}

export type CdsDeletedDocData = {
  PK_FILES: string
  ROW_NUM: number
  C_TOTAL_RECORD: number
  FILE_NAME?: string | null
  FILE_SIZE?: number | null
  FILE_PATH?: string | null
  DOCUMENTNUMBER?: string | null
  ISSUEDDATE?: string | null
  EXPIRYDATE?: string | null
  MODIFIED?: string | null
  DATETIME?: string | null
  UPLOADEDBY?: string | null
  UPLOADEDBYDEPARTMENT?: string | null
  DOC_TYPE?: string | null
  SUMMARY?: string | null
  VIEW_COUNT?: number | null
  FORDER_ID?: string | null
}

/** GET_ALL_PROJECT */
export type CdsProjectListPayload = CodeNameListPayload

export type CdsProjectData = {
  PK_PROJECT: string
  ROW_NUM: number
  C_TOTAL_RECORD: number
  C_PROJECT_NAME?: string | null
  C_NAME?: string | null
  C_COMPANY?: string | null
  C_COMPANY_NAME?: string | null
  C_PM?: string | null
  C_PM_NAME?: string | null
  C_DESCRIPTION?: string | null
  C_NOTE?: string | null
  C_START_DATE?: string | null
  C_END_DATE?: string | null
  C_STATUS?: number | null
}

/** GET_ALL_PHASE */
export type CdsPhaseListPayload = CodeNameListPayload

export type CdsPhaseData = {
  PK_PHASE: string
  ROW_NUM: number
  C_TOTAL_RECORD: number
  C_PHASE_NAME?: string | null
  C_NAME?: string | null
  C_PROJECT_NAME?: string | null
  C_PROJECT_CODE?: string | null
  C_PHASE_CODE?: string | null
  C_CODE?: string | null
  C_START_DATE?: string | null
  C_END_DATE?: string | null
  C_DESCRIPTION?: string | null
  C_NOTE?: string | null
  C_STATUS?: number | null
}

/** GET_ALL_FEATURE */
export type CdsFeatureListPayload = CodeNameListPayload

export type CdsFeatureData = {
  PK_FEATURE: string
  ROW_NUM: number
  C_TOTAL_RECORD: number
  C_FEATURE_NAME?: string | null
  C_NAME?: string | null
  C_PROJECT_NAME?: string | null
  C_PHASE_NAME?: string | null
  C_PM?: string | null
  C_PM_NAME?: string | null
  C_PRIORITY?: string | number | null
  C_START_DATE?: string | null
  C_END_DATE?: string | null
  C_STATUS?: number | null
}

/** GET_ALL_TASK */
export type CdsTaskListPayload = CodeNameListPayload

export type CdsTaskData = {
  PK_TASK: string
  ROW_NUM: number
  C_TOTAL_RECORD: number
  C_JIRA_KEY?: string | null
  C_FEATURE_NAME?: string | null
  C_PHASE_ID?: string | null
  C_START_DATE?: string | null
  C_END_DATE?: string | null
  C_ESTIMATE?: string | number | null
  C_DESCRIPTION?: string | null
  C_NOTE?: string | null
  C_STATUS?: number | null
}
