import type { BackUserGroupListPayload, BackUserGroupSearchKeys } from '@/features/system/services'

export const DEFAULT_BACK_USER_GROUP_SEARCH: BackUserGroupSearchKeys = {
  CODE: '',
  NAME: '',
  ACTIVE: 1,
}

export const DEFAULT_BACK_USER_GROUP_PAYLOAD: BackUserGroupListPayload = {
  ...DEFAULT_BACK_USER_GROUP_SEARCH,
  PAGE: 1,
  RECORD_PER_PAGE: 10,
}
