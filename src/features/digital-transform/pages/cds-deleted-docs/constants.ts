import type { CdsDeletedDocListPayload } from '@/features/digital-transform/services'
import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from '@/shared/constants/listDefaults'

export const DEFAULT_CDS_DELETED_DOC_PAYLOAD: CdsDeletedDocListPayload = {
  PAGE: DEFAULT_LIST_PAGE,
  RECORD_PER_PAGE: DEFAULT_LIST_PAGE_SIZE,
  FILTER: '',
}
