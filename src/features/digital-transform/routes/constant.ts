import { TabItem } from '@/shared/types'

// ______ CDS — mã quyền Chuyển đổi số (CĐS) ____________________________________
export const CDS_RIGHT = {
  // Tab chính
  FOLDER_TREE: 'ALL', // Cây thư mục CĐS
  FRONT_USER: 'ALL', // Người dùng Front CĐS
  PROJECT_MANAGEMENT: 'ALL', // Quản lý dự án CĐS

  // Tab con — Cây thư mục CĐS
  FOLDER_FUNC_TREE: 'ALL',
  DELETED_DOC: 'ALL',

  // Tab con — Người dùng Front CĐS
  SUB_FRONT_USER: 'ALL',
  FRONT_GROUP: 'ALL',

  // Tab con — Quản lý dự án CĐS
  TEAM_LIST: 'ALL',
  PROJECT_LIST: 'ALL',
  PHASE_LIST: 'ALL',
  FEATURE_LIST: 'ALL',
  TASK_LIST: 'ALL',
} as const

export const CDS_PATH = {
  ROOT: '/digital-transform',
  FOLDER_TREE: '/digital-transform/folder-tree',
  FOLDER_FUNC_TREE: '/digital-transform/folder-tree/func-tree',
  FOLDER_DELETED_DOCS: '/digital-transform/folder-tree/deleted-docs',
  FRONT_USER: '/digital-transform/front-user',
  FRONT_USER_SUB: '/digital-transform/front-user/users',
  FRONT_USER_GROUP: '/digital-transform/front-user/groups',
  PROJECT_MANAGEMENT: '/digital-transform/project-management',
  PROJECT_TEAMS: '/digital-transform/project-management/teams',
  PROJECT_PROJECTS: '/digital-transform/project-management/projects',
  PROJECT_PHASES: '/digital-transform/project-management/phases',
  PROJECT_FEATURES: '/digital-transform/project-management/features',
  PROJECT_TASKS: '/digital-transform/project-management/tasks',
} as const

/** Tab con — Quản lý dự án CĐS */
export const CDS_PROJECT_TABS: TabItem[] = [
  {
    label: 'tab.cdsTeamList',
    path: CDS_PATH.PROJECT_TEAMS,
    right: CDS_RIGHT.TEAM_LIST,
  },
  {
    label: 'tab.cdsProjectList',
    path: CDS_PATH.PROJECT_PROJECTS,
    right: CDS_RIGHT.PROJECT_LIST,
  },
  {
    label: 'tab.cdsPhaseList',
    path: CDS_PATH.PROJECT_PHASES,
    right: CDS_RIGHT.PHASE_LIST,
  },
  {
    label: 'tab.cdsFeatureList',
    path: CDS_PATH.PROJECT_FEATURES,
    right: CDS_RIGHT.FEATURE_LIST,
  },
  {
    label: 'tab.cdsTaskList',
    path: CDS_PATH.PROJECT_TASKS,
    right: CDS_RIGHT.TASK_LIST,
  },
]

/** Tab con — Người dùng Front CĐS */
export const CDS_FRONT_TABS: TabItem[] = [
  {
    label: 'tab.cdsFrontUser',
    path: CDS_PATH.FRONT_USER_SUB,
    right: CDS_RIGHT.SUB_FRONT_USER,
  },
  {
    label: 'tab.cdsFrontGroup',
    path: CDS_PATH.FRONT_USER_GROUP,
    right: CDS_RIGHT.FRONT_GROUP,
  },
]

/** Tab con — Cây thư mục CĐS */
export const CDS_FOLDER_TABS: TabItem[] = [
  {
    label: 'tab.cdsFolderFuncTree',
    path: CDS_PATH.FOLDER_FUNC_TREE,
    right: CDS_RIGHT.FOLDER_FUNC_TREE,
  },
  {
    label: 'tab.cdsDeletedDocs',
    path: CDS_PATH.FOLDER_DELETED_DOCS,
    right: CDS_RIGHT.DELETED_DOC,
  },
]

/** Tab chính — Chuyển đổi số */
export const CDS_MAIN_TABS: TabItem[] = [
  {
    label: 'tab.cdsFolderTree',
    path: CDS_PATH.FOLDER_TREE,
    matchPrefix: true,
    right: CDS_RIGHT.FOLDER_TREE,
  },
  {
    label: 'tab.cdsFrontUser',
    path: CDS_PATH.FRONT_USER,
    matchPrefix: true,
    right: CDS_RIGHT.FRONT_USER,
  },
  {
    label: 'tab.cdsProjectManagement',
    path: CDS_PATH.PROJECT_MANAGEMENT,
    matchPrefix: true,
    right: CDS_RIGHT.PROJECT_MANAGEMENT,
  },
]
