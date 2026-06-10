import type {
  CommonCategoryListPayload,
  CommonCategorySearchKeys,
} from '@/features/system/services'

/** Giá trị `GROUP` gửi API BACK.GET_ALL_LISTTYPE */
export const COMMON_CATEGORY_GROUP = {
  ALL: '',
  USER: 'USER',
  SYSTEM: 'SYSTEM',
} as const

export const DEFAULT_COMMON_CATEGORY_SEARCH: CommonCategorySearchKeys = {
  CODE: '',
  NAME: '',
  GROUP: '',
}

export const DEFAULT_COMMON_CATEGORY_PAYLOAD: CommonCategoryListPayload = {
  ...DEFAULT_COMMON_CATEGORY_SEARCH,
  PAGE: 1,
  RECORD_PER_PAGE: 10,
}
