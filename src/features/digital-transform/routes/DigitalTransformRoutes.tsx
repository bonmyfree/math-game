import { createRoute, redirect, type AnyRoute } from '@tanstack/react-router'

import {
  CdsFolderFuncTreePage,
  CdsDeletedDocsPage,
  CdsSubFrontUserPage,
  CdsFrontGroupPage,
  CdsTeamListPage,
  CdsProjectListPage,
  CdsPhaseListPage,
  CdsFeatureListPage,
  CdsTaskListPage,
} from '@/app/lazyRoutes'
import { checkPermission } from '@/shared/hooks/usePermission'

import {
  CDS_FOLDER_TABS,
  CDS_FRONT_TABS,
  CDS_MAIN_TABS,
  CDS_PATH,
  CDS_PROJECT_TABS,
  CDS_RIGHT,
} from './constant'
import { DigitalTransformLayout } from '../layouts/DigitalTransformLayout'
import { FolderTreeLayout } from '../layouts/FolderTreeLayout'
import { FrontUserLayout } from '../layouts/FrontUserLayout'
import { ProjectManagementLayout } from '../layouts/ProjectManagementLayout'

/**
 * Subtree `/digital-transform` — tab chính CĐS (cùng pattern `createSystemRoutes`).
 */
export function createDigitalTransformRoutes(parent: AnyRoute) {
  const cdsRoot = createRoute({
    getParentRoute: () => parent,
    path: '/digital-transform',
    component: DigitalTransformLayout,
    beforeLoad: ({ location }) => {
      if (location.pathname !== CDS_PATH.ROOT) return
      const first = CDS_MAIN_TABS.find(({ right }) => checkPermission(right))
      if (first) throw redirect({ to: first.path })
    },
  })

  const folderTreeRoute = createRoute({
    getParentRoute: () => cdsRoot,
    path: 'folder-tree',
    component: FolderTreeLayout,
    beforeLoad: ({ location }) => {
      if (!checkPermission(CDS_RIGHT.FOLDER_TREE)) throw redirect({ to: CDS_PATH.ROOT })

      if (location.pathname === CDS_PATH.FOLDER_TREE) {
        const first = CDS_FOLDER_TABS.find(({ right }) => checkPermission(right))
        if (first) throw redirect({ to: first.path })
      }
    },
  })

  const folderFuncTreeRoute = createRoute({
    getParentRoute: () => folderTreeRoute,
    path: '/func-tree',
    component: CdsFolderFuncTreePage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.FOLDER_FUNC_TREE)) throw redirect({ to: CDS_PATH.FOLDER_TREE })
    },
  })

  const deletedDocsRoute = createRoute({
    getParentRoute: () => folderTreeRoute,
    path: '/deleted-docs',
    component: CdsDeletedDocsPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.DELETED_DOC)) throw redirect({ to: CDS_PATH.FOLDER_TREE })
    },
  })

  const frontUserRoute = createRoute({
    getParentRoute: () => cdsRoot,
    path: 'front-user',
    component: FrontUserLayout,
    beforeLoad: ({ location }) => {
      if (!checkPermission(CDS_RIGHT.FRONT_USER)) throw redirect({ to: CDS_PATH.ROOT })

      if (location.pathname === CDS_PATH.FRONT_USER) {
        const first = CDS_FRONT_TABS.find(({ right }) => checkPermission(right))
        if (first) throw redirect({ to: first.path })
      }
    },
  })

  const subFrontUserRoute = createRoute({
    getParentRoute: () => frontUserRoute,
    path: '/users',
    component: CdsSubFrontUserPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.SUB_FRONT_USER)) throw redirect({ to: CDS_PATH.FRONT_USER })
    },
  })

  const frontGroupRoute = createRoute({
    getParentRoute: () => frontUserRoute,
    path: '/groups',
    component: CdsFrontGroupPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.FRONT_GROUP)) throw redirect({ to: CDS_PATH.FRONT_USER })
    },
  })

  const projectManagementRoute = createRoute({
    getParentRoute: () => cdsRoot,
    path: 'project-management',
    component: ProjectManagementLayout,
    beforeLoad: ({ location }) => {
      if (!checkPermission(CDS_RIGHT.PROJECT_MANAGEMENT)) throw redirect({ to: CDS_PATH.ROOT })

      if (location.pathname === CDS_PATH.PROJECT_MANAGEMENT) {
        const first = CDS_PROJECT_TABS.find(({ right }) => checkPermission(right))
        if (first) throw redirect({ to: first.path })
      }
    },
  })

  const teamListRoute = createRoute({
    getParentRoute: () => projectManagementRoute,
    path: '/teams',
    component: CdsTeamListPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.TEAM_LIST)) throw redirect({ to: CDS_PATH.PROJECT_MANAGEMENT })
    },
  })

  const projectListRoute = createRoute({
    getParentRoute: () => projectManagementRoute,
    path: '/projects',
    component: CdsProjectListPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.PROJECT_LIST))
        throw redirect({ to: CDS_PATH.PROJECT_MANAGEMENT })
    },
  })

  const phaseListRoute = createRoute({
    getParentRoute: () => projectManagementRoute,
    path: '/phases',
    component: CdsPhaseListPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.PHASE_LIST))
        throw redirect({ to: CDS_PATH.PROJECT_MANAGEMENT })
    },
  })

  const featureListRoute = createRoute({
    getParentRoute: () => projectManagementRoute,
    path: '/features',
    component: CdsFeatureListPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.FEATURE_LIST))
        throw redirect({ to: CDS_PATH.PROJECT_MANAGEMENT })
    },
  })

  const taskListRoute = createRoute({
    getParentRoute: () => projectManagementRoute,
    path: '/tasks',
    component: CdsTaskListPage,
    beforeLoad: () => {
      if (!checkPermission(CDS_RIGHT.TASK_LIST)) throw redirect({ to: CDS_PATH.PROJECT_MANAGEMENT })
    },
  })

  return cdsRoot.addChildren([
    folderTreeRoute.addChildren([folderFuncTreeRoute, deletedDocsRoute]),
    frontUserRoute.addChildren([subFrontUserRoute, frontGroupRoute]),
    projectManagementRoute.addChildren([
      teamListRoute,
      projectListRoute,
      phaseListRoute,
      featureListRoute,
      taskListRoute,
    ]),
  ])
}
