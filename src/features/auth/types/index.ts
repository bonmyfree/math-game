/** Current-user account record returned by the profile lookup API. */
export type BackUserData = {
  PK_USER: string
  C_BACK_USER_CODE: string | null
  C_USER_NAME: string | null
  C_BRANCH_CODE: string | null
  C_SUB_BRANCH_CODE: string | null
  ROW_NUM: number
  C_TOTAL_RECORD: number
  C_STATUS?: number | null
  C_LOCK_FLAG?: number | null
  C_LOGIN_FAIL?: number | null
  C_CREATE_TIME?: string | null
  C_LOGIN_TIME?: string | null
  C_CREATOR_CODE?: string | null
  C_USER_TYPE?: string | null
  C_USER_MODE?: string | null
  C_IS_ADMIN?: number | null
  C_DESCRIPTION?: string | null
  C_GROUP_RIGHT_LIST?: string | null
  C_PASSWORD?: string | null
  C_ORDER?: number | null
  C_PHONE_LINE?: string | null
  C_FRONT_USER_CODE?: string | null
  C_ACCOUNT_UPDATE_LIST?: string | null
  C_ACCOUNT_UPDATE?: string | null
  C_APPROVE_ON_MONEY?: string | null
  C_REPORT_BY_ACCOUNT?: string | null
  C_REPORT_BY_ACCOUNT_LIST?: string | null
  C_RIGHT_BY_MANAGE_LIST?: string | null
  C_RIGHT_BY_ACCOUNT_LIST?: string | null
  C_RIGHT_BY_ACCOUNT?: string | null
  C_RIGHT_BY_MANAGE?: string | null
  C_RESET_PWD_FLAG?: number | null
}
