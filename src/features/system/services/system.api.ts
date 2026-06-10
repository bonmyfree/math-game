import { CMD, GROUP } from '@/shared/constants'
import { apiService } from '@/shared/services/api.service'
import type { AuthorityTreeRow, PaginationData } from '@/shared/types'

import {
  BackUserGroupListPayload,
  BackUserGroupData,
  BackUserListPayload,
  BackUserData,
  CommonCategoryListPayload,
  CommonCategoryData,
  CodeNameListPayload,
  DepartmentBlockData,
  DeleteBackFunctionPayload,
  SaveBackFunctionPayload,
  SystemLogData,
  SystemLogDetailData,
  SystemLogPayload,
} from './system.types'

export const systemApi = {
  getSystemLogs: (payload: SystemLogPayload) =>
    apiService.command<SystemLogData[], SystemLogPayload>(CMD.GET_SYSTEM_LOGS, GROUP.LIST, {
      ...payload,
    }),

  getSystemLogDetail: (id: string) =>
    apiService.command<SystemLogDetailData[], unknown>(CMD.GET_SINGLE_DATA_LOG, GROUP.LIST, {
      ITEM_ID: id,
    }),

  getAllAuthority: (data: PaginationData) =>
    apiService.command<AuthorityTreeRow[], PaginationData>(CMD.GET_ALL_AUTHORITY, GROUP.LIST, data),

  saveBackFunction: (data: SaveBackFunctionPayload) =>
    apiService.command<unknown, SaveBackFunctionPayload>(CMD.SAVE_AUTHORITY, GROUP.LIST, data),

  deleteBackFunction: (data: DeleteBackFunctionPayload) =>
    apiService.command<unknown, DeleteBackFunctionPayload>(CMD.DELETE_AUTHORITY, GROUP.LIST, data),

  getAllBackUserGroups: (data: BackUserGroupListPayload) =>
    apiService.command<BackUserGroupData[], BackUserGroupListPayload>(
      CMD.GET_ALL_BACK_USER_GROUP,
      GROUP.LIST,
      data,
    ),

  getAllBackUsers: (data: BackUserListPayload) =>
    apiService.command<BackUserData[], BackUserListPayload>(
      CMD.GET_ALL_BACK_USER,
      GROUP.LIST,
      data,
    ),

  getAllListTypes: (data: CommonCategoryListPayload) =>
    apiService.command<CommonCategoryData[], CommonCategoryListPayload>(
      CMD.GET_ALL_LISTTYPE,
      GROUP.LIST,
      data,
    ),

  getAllDepartmentBlocks: (data: CodeNameListPayload) =>
    apiService.command<DepartmentBlockData[], CodeNameListPayload>(
      CMD.GET_ALL_LIST_VPBS_BUSINESS,
      GROUP.LIST,
      data,
    ),
}
