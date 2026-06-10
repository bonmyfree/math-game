import { PaginationData } from '@/shared/types'

export type SystemLogPayload = SystemLogSearchKeys & PaginationData

export type SystemLogSearchKeys = {
  USER_CODE: string
  BUSSINESS_CODE: string
  ACTION_CODE: string
  DATA_CODE: string
  FROM_DATE: string
  TO_DATE: string
}

export type SystemLogDetail = {
  C_ACCOUNT_CODE: string | null
  C_ACTION_TYPE: string | null
  C_APPROVER_CODE: string | null
  C_APPROVE_TIME: string | null
  C_BUSINESS_CODE: string | null
  C_CONTENT: string | null
  C_CREATE_TIME: string | null
  C_CREATOR_CODE: string | null
  C_CUSTOMER_CODE: string | null
  C_DATA_CODE: string | null
  C_KEY_DATA: string | null
  C_KEY_NAME: string | null
  C_SEQUENCE_NO: string | null
  C_STATUS: string | null
  C_TABLE_NAME: string | null
  C_TRADING_DATE: string | null
  C_UPDATE_TIME: string | null
  C_UPDATOR_CODE: string | null
  FK_REQUEST_INFO: string | null
  PK_REQUEST_INFO: string | null
}

export type SystemLogData = SystemLogDetail & {
  C_TOTAL_RECORD: number
  ROW_NUM: number
}

export type SystemLogDetailData = SystemLogDetail & {
  C_NEW_DATA: string
  C_OLD_DATA: string
}

export type BackFunctionFlag = 0 | 1

export type SaveBackFunctionPayload = {
  ITEM_ID: string
  GROUP: string
  CODE: string
  NAME: string
  MENU_NAME?: string | null
  PARENT_CODE: string
  VIEW_FLAG: BackFunctionFlag
  UPDATE_FLAG: BackFunctionFlag
  APPROVE_FLAG: BackFunctionFlag
  MENU_FLAG: BackFunctionFlag
  ADMIN_FLAG: BackFunctionFlag
  ACTIVE: BackFunctionFlag
  CONTENT?: string | null
}

export type DeleteBackFunctionPayload = {
  LIST_ITEM_ID: string
}

/** PERMISSION.GET_ALL_USER_GROUP — payload `data` */
export type BackUserGroupListPayload = {
  CODE: string
  NAME: string
  ACTIVE: number
  PAGE: number
  RECORD_PER_PAGE: number
}

export type BackUserGroupSearchKeys = Pick<BackUserGroupListPayload, 'CODE' | 'NAME' | 'ACTIVE'>

export type BackUserGroupData = {
  C_USER_GROUP_CODE: string
  C_STATUS: number
  C_CREATOR_CODE?: string | null
  ROW_NUM: number
  PK_USER_GROUP: string
  C_CREATE_TIME: string | null
  C_USER_GROUP_NAME: string
  C_NOTE: string | null
  C_TOTAL_RECORD: number
  C_ORDER: number
}

/** BACK.GET_ALL_LISTTYPE — payload `data` */
export type CommonCategoryListPayload = {
  CODE: string
  NAME: string
  GROUP: string
  PAGE: number
  RECORD_PER_PAGE: number
}

export type CommonCategorySearchKeys = Pick<CommonCategoryListPayload, 'CODE' | 'NAME' | 'GROUP'>

export type CommonCategoryData = {
  PK_LISTTYPE: string
  C_CODE: string
  C_NAME: string
  C_GROUP: string
  C_ORDER: number
  C_STATUS: number
  C_NOTE: string | null
  C_DIRECTORY: string | null
  ROW_NUM: number
  C_TOTAL_RECORD: number
}

/** BACK.GET_ALL_USER — payload `data` */
export type BackUserListPayload = {
  BRANCH: string
  SUB_BRANCH: string
  CODE: string
  NAME: string
  GROUP: string
  PAGE: number
  RECORD_PER_PAGE: number
}

export type BackUserListSearchKeys = Omit<BackUserListPayload, 'PAGE' | 'RECORD_PER_PAGE'>

/** Một dòng danh sách người dùng Back (theo API) */
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

/** Payload danh sách có phân trang + tìm theo mã/tên */
export type CodeNameListPayload = {
  CODE: string
  NAME: string
  PAGE: number
  RECORD_PER_PAGE: number
}

export type CodeNameSearchKeyword = Pick<CodeNameListPayload, 'CODE' | 'NAME'>

/** BACK.GET_ALL_LIST_VPBS_BUSINESS — Khối */
export type DepartmentBlockData = {
  PK_VPBS_BUSINESS?: string
  C_CODE: string
  C_NAME: string
  C_NOTE?: string | null
  ROW_NUM: number
  C_TOTAL_RECORD: number
}
