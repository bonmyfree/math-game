import { useSystemStore } from '@/shared/stores'
import { ApiResponse, type AuthorityTreeRow } from '@/shared/types'

import { systemApi } from './system.api'
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

export const systemService = {
  getSystemLogs: async (payload: SystemLogPayload): Promise<SystemLogData[]> => {
    const store = useSystemStore.getState()

    const res: ApiResponse<SystemLogData[]> = await systemApi.getSystemLogs(payload)

    if (res.iRc === 1 && Array.isArray(res.data)) {
      store.setEodLogs(res.data)
      return res.data
    }

    console.warn('Lay logs he thong that bai', res.sRs)
    store.setEodLogs([])
    return res.data
  },

  getSystemLogDetail: async (id: string): Promise<SystemLogDetailData[]> => {
    const res: ApiResponse<SystemLogDetailData[]> = await systemApi.getSystemLogDetail(id)

    if (res.iRc === 1 && Array.isArray(res.data)) {
      return res.data
    }

    console.warn('Lay chi tiet log that bai', res.sRs)
    return res.data
  },

  getAllAuthority: async (): Promise<AuthorityTreeRow[]> => {
    const res: ApiResponse<AuthorityTreeRow[]> = await systemApi.getAllAuthority({
      PAGE: 1,
      RECORD_PER_PAGE: 10000,
    })

    if (res.iRc === 1 && Array.isArray(res.data)) {
      return res.data
    }

    console.warn('Lay danh sach quyen that bai', res.sRs)
    return []
  },

  createBackFunction: async (payload: SaveBackFunctionPayload): Promise<boolean> => {
    const res: ApiResponse<unknown> = await systemApi.saveBackFunction({
      ...payload,
      ITEM_ID: '',
    })

    if (res.iRc === 1) return true

    console.warn('Them chuc nang Back that bai', res.sRs)
    return false
  },

  updateBackFunction: async (payload: SaveBackFunctionPayload): Promise<boolean> => {
    const res: ApiResponse<unknown> = await systemApi.saveBackFunction(payload)

    if (res.iRc === 1) return true

    console.warn('Cap nhat chuc nang Back that bai', res.sRs)
    return false
  },

  deleteBackFunction: async (payload: DeleteBackFunctionPayload): Promise<boolean> => {
    const res: ApiResponse<unknown> = await systemApi.deleteBackFunction(payload)

    if (res.iRc === 1) return true

    console.warn('Xoa chuc nang Back that bai', res.sRs)
    return false
  },

  getAllBackUserGroups: async (payload: BackUserGroupListPayload): Promise<BackUserGroupData[]> => {
    const res: ApiResponse<BackUserGroupData[]> = await systemApi.getAllBackUserGroups(payload)

    if (res.iRc === 1 && Array.isArray(res.data)) {
      return res.data
    }

    console.warn('Lay danh sach nhom nguoi dung Back that bai', res.sRs)
    return []
  },

  getAllBackUsers: async (payload: BackUserListPayload): Promise<BackUserData[]> => {
    const res: ApiResponse<BackUserData[]> = await systemApi.getAllBackUsers(payload)

    if (res.iRc === 1 && Array.isArray(res.data)) {
      return res.data
    }

    console.warn('Lay danh sach nguoi dung Back that bai', res.sRs)
    return []
  },

  getAllListTypes: async (payload: CommonCategoryListPayload): Promise<CommonCategoryData[]> => {
    const res: ApiResponse<CommonCategoryData[]> = await systemApi.getAllListTypes(payload)

    if (res.iRc === 1 && Array.isArray(res.data)) {
      return res.data
    }

    console.warn('Lay danh sach danh muc chung that bai', res.sRs)
    return []
  },

  getAllDepartmentBlocks: async (payload: CodeNameListPayload): Promise<DepartmentBlockData[]> => {
    const res: ApiResponse<DepartmentBlockData[]> = await systemApi.getAllDepartmentBlocks(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach khoi that bai', res.sRs)
    return []
  },
}
