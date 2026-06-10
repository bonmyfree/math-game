import type { CodeNameListPayload } from '@/features/system/services'
import {
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
  EMPTY_CODE_NAME_SEARCH,
} from '@/shared/constants/listDefaults'

export const DEFAULT_DEPARTMENT_BLOCK_PAYLOAD: CodeNameListPayload = {
  ...EMPTY_CODE_NAME_SEARCH,
  PAGE: DEFAULT_LIST_PAGE,
  RECORD_PER_PAGE: DEFAULT_LIST_PAGE_SIZE,
}
