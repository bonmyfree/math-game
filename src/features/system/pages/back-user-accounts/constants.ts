import type { BackUserListPayload, BackUserListSearchKeys } from '@/features/system/services'

export const DEFAULT_BACK_USER_SEARCH: BackUserListSearchKeys = {
  BRANCH: '',
  SUB_BRANCH: '',
  CODE: '',
  NAME: '',
  GROUP: '',
}

export const DEFAULT_BACK_USER_LIST_PAYLOAD: BackUserListPayload = {
  ...DEFAULT_BACK_USER_SEARCH,
  PAGE: 1,
  RECORD_PER_PAGE: 10,
}
