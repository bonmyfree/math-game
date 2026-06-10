/** Bản ghi quyền / chức năng — API PERMISSION.GET_ALL_AUTHORITY (flat list + C_LEVEL / C_PARENT_CODE) */
export interface AuthorityTreeRow {
  PK_AUTHORITY: string | number
  C_LEVEL: number
  C_CODE: string
  C_PARENT_CODE: string | null
  /** Hiển thị cây (thường là C_PATH_NAME hoặc C_MENU_NAME) */
  C_MENU_NAME: string
  C_NAME?: string
  C_PATH_NAME?: string
  C_ADMIN_FLAG: 0 | 1
  C_ACTIVE: 0 | 1
  C_APPROVE_FLAG: 0 | 1
  C_UPDATE_FLAG: 0 | 1
  C_VIEW_FLAG: 0 | 1
  C_SHARE_FLAG?: 0 | 1
  C_COMPANY_ID?: string
  ROW_NUM?: number
  C_CONTENT?: string
  C_TOTAL_RECORD?: number
  C_GROUP?: string
  C_ORDER?: number
  C_CREATOR_CODE?: string
  C_ORDER_STRING?: string | null
  C_CREATE_TIME?: string
  C_MENU_FLAG?: number
}
