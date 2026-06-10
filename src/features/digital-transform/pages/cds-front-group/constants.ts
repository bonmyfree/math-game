import type { CdsFrontGroupListPayload } from '@/features/digital-transform/services'
import {
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
  EMPTY_CODE_NAME_SEARCH,
} from '@/shared/constants/listDefaults'

export const DEFAULT_CDS_FRONT_GROUP_PAYLOAD: CdsFrontGroupListPayload = {
  ...EMPTY_CODE_NAME_SEARCH,
  ACTIVE: 1,
  PAGE: DEFAULT_LIST_PAGE,
  RECORD_PER_PAGE: DEFAULT_LIST_PAGE_SIZE,
}
