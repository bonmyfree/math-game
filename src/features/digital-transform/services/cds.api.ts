import { CMD, GROUP } from '@/shared/constants'
import { apiService } from '@/shared/services/api.service'

import type {
  CdsDeletedDocData,
  CdsDeletedDocListPayload,
  CdsRestoreFilePayload,
  CdsRestoreFileResult,
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

export const cdsApi = {
  getAllFrontUsers: (data: CdsFrontUserListPayload) =>
    apiService.command<CdsFrontUserData[], CdsFrontUserListPayload>(
      CMD.GET_ALL_USER,
      GROUP.LIST,
      data,
    ),

  getAllFrontGroups: (data: CdsFrontGroupListPayload) =>
    apiService.command<CdsFrontGroupData[], CdsFrontGroupListPayload>(
      CMD.GET_ALL_USER_GROUP,
      GROUP.LIST,
      data,
    ),

  getAllTeams: (data: CdsTeamListPayload) =>
    apiService.command<CdsTeamData[], CdsTeamListPayload>(CMD.GET_ALL_TEAM, GROUP.LIST, data),

  getDeletedDocs: (data: CdsDeletedDocListPayload) =>
    apiService.command<CdsDeletedDocData[], CdsDeletedDocListPayload>(
      CMD.LIST_FILE_UNDO,
      GROUP.DM,
      data,
    ),

  restoreFile: (data: CdsRestoreFilePayload) =>
    apiService.command<CdsRestoreFileResult[], CdsRestoreFilePayload>(
      CMD.UNDO_FILE,
      GROUP.DM,
      data,
    ),

  getAllProjects: (data: CdsProjectListPayload) =>
    apiService.command<CdsProjectData[], CdsProjectListPayload>(
      CMD.GET_ALL_PROJECT,
      GROUP.LIST,
      data,
    ),

  getAllPhases: (data: CdsPhaseListPayload) =>
    apiService.command<CdsPhaseData[], CdsPhaseListPayload>(CMD.GET_ALL_PHASE, GROUP.LIST, data),

  getAllFeatures: (data: CdsFeatureListPayload) =>
    apiService.command<CdsFeatureData[], CdsFeatureListPayload>(
      CMD.GET_ALL_FEATURE,
      GROUP.LIST,
      data,
    ),

  getAllTasks: (data: CdsTaskListPayload) =>
    apiService.command<CdsTaskData[], CdsTaskListPayload>(CMD.GET_ALL_TASK, GROUP.LIST, data),
}
