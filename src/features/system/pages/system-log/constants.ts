import { SystemLogPayload, SystemLogSearchKeys } from '@/features/system/services'

export const DEFAULT_FILTER: SystemLogSearchKeys = {
  USER_CODE: '',
  BUSSINESS_CODE: '',
  ACTION_CODE: '',
  DATA_CODE: '',
  FROM_DATE: '',
  TO_DATE: '',
} as const

export const DEFAULT_PAYLOAD: SystemLogPayload = {
  ...DEFAULT_FILTER,
  PAGE: 1,
  RECORD_PER_PAGE: 10,
} as const
