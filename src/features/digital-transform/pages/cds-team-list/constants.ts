import type { CdsTeamListPayload } from '@/features/digital-transform/services'
import {
  DEFAULT_LIST_PAGE,
  DEFAULT_LIST_PAGE_SIZE,
  EMPTY_CODE_NAME_SEARCH,
} from '@/shared/constants/listDefaults'

export const DEFAULT_CDS_TEAM_PAYLOAD: CdsTeamListPayload = {
  ...EMPTY_CODE_NAME_SEARCH,
  PAGE: DEFAULT_LIST_PAGE,
  RECORD_PER_PAGE: DEFAULT_LIST_PAGE_SIZE,
}
