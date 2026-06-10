import { ApiResponse } from '@/shared/types'

import { cdsApi } from './cds.api'

import type {
  CdsDeletedDocData,
  CdsDeletedDocListPayload,
  CdsRestoreFilePayload,
  CdsFeatureData,
  CdsFeatureListPayload,
  CdsFrontGroupData,
  CdsFrontGroupListPayload,
  CdsFrontUserData,
  CdsFrontUserListPayload,
  CdsPhaseData,
  CdsPhaseListPayload,
  CdsProjectData,
  CdsProjectListPayload,
  CdsTaskData,
  CdsTaskListPayload,
  CdsTeamData,
  CdsTeamListPayload,
} from './cds.types'

export const cdsService = {
  getAllFrontUsers: async (payload: CdsFrontUserListPayload): Promise<CdsFrontUserData[]> => {
    const res: ApiResponse<CdsFrontUserData[]> = await cdsApi.getAllFrontUsers(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach nguoi dung Front CDS that bai', res.sRs)
    return []
  },

  getAllFrontGroups: async (payload: CdsFrontGroupListPayload): Promise<CdsFrontGroupData[]> => {
    const res: ApiResponse<CdsFrontGroupData[]> = await cdsApi.getAllFrontGroups(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach nhom Front CDS that bai', res.sRs)
    return []
  },

  getAllTeams: async (payload: CdsTeamListPayload): Promise<CdsTeamData[]> => {
    const res: ApiResponse<CdsTeamData[]> = await cdsApi.getAllTeams(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach team CDS that bai', res.sRs)
    return []
  },

  getDeletedDocs: async (payload: CdsDeletedDocListPayload): Promise<CdsDeletedDocData[]> => {
    const res: ApiResponse<CdsDeletedDocData[]> = await cdsApi.getDeletedDocs(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach tai lieu da xoa that bai', res.sRs)
    return []
  },

  restoreFile: async (payload: CdsRestoreFilePayload): Promise<boolean> => {
    const res = await cdsApi.restoreFile(payload)
    if (res.iRc !== 1) {
      console.warn('Khoi phuc tai lieu that bai', res.sRs)
      return false
    }
    return res.data?.[0]?.RS === '1'
  },

  getAllProjects: async (payload: CdsProjectListPayload): Promise<CdsProjectData[]> => {
    const res: ApiResponse<CdsProjectData[]> = await cdsApi.getAllProjects(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach du an CDS that bai', res.sRs)
    return []
  },

  getAllPhases: async (payload: CdsPhaseListPayload): Promise<CdsPhaseData[]> => {
    const res: ApiResponse<CdsPhaseData[]> = await cdsApi.getAllPhases(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach giai doan CDS that bai', res.sRs)
    return []
  },

  getAllFeatures: async (payload: CdsFeatureListPayload): Promise<CdsFeatureData[]> => {
    const res: ApiResponse<CdsFeatureData[]> = await cdsApi.getAllFeatures(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach tinh nang CDS that bai', res.sRs)
    return []
  },

  getAllTasks: async (payload: CdsTaskListPayload): Promise<CdsTaskData[]> => {
    const res: ApiResponse<CdsTaskData[]> = await cdsApi.getAllTasks(payload)
    if (res.iRc === 1 && Array.isArray(res.data)) return res.data
    console.warn('Lay danh sach cong viec CDS that bai', res.sRs)
    return []
  },
}
