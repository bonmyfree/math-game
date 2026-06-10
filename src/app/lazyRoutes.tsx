import { lazy, Suspense, type LazyExoticComponent, type ComponentType } from 'react'

import { PageLoader } from '@/shared/components/ui/PageLoader'

function withSuspense(Component: LazyExoticComponent<ComponentType<Record<string, never>>>) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    )
  }
}

// Auth - pages
export const LoginPage = withSuspense(lazy(() => import('@/features/auth/pages/LoginPage')))
export const ChangePasswordPage = withSuspense(
  lazy(() => import('@/features/auth/pages/ChangePasswordPage')),
)
export const ProfilePage = withSuspense(lazy(() => import('@/features/auth/pages/ProfilePage')))

// Dashboard
export const DashboardPage = withSuspense(
  lazy(() => import('@/features/dashboard/pages/DashboardPage')),
)

// System — Vận hành
export const SystemLogPage = withSuspense(
  lazy(() => import('@/features/system/pages/system-log/SystemLogPage')),
)

// Users
export const UserListPage = withSuspense(
  lazy(() =>
    import('@/features/users/pages/UserListPage').then((m) => ({ default: m.UserListPage })),
  ),
)
export const UserRolesPage = withSuspense(
  lazy(() =>
    import('@/features/users/pages/UserRolesPage').then((m) => ({ default: m.UserRolesPage })),
  ),
)

export const BackFunctionPage = withSuspense(
  lazy(() => import('@/features/system/pages/back-function/BackFunctionPage')),
)
export const BackUserGroupPage = withSuspense(
  lazy(() => import('@/features/system/pages/back-user-group/BackUserGroupPage')),
)
export const BackUserAccountsPage = withSuspense(
  lazy(() => import('@/features/system/pages/back-user-accounts/BackUserAccountsPage')),
)
export const CommonCategoryPage = withSuspense(
  lazy(() => import('@/features/system/pages/common-category/CommonCategoryPage')),
)
export const DepartmentBlockPage = withSuspense(
  lazy(() => import('@/features/system/pages/department-block/DepartmentBlockPage')),
)

// Chuyển đổi số (CĐS)
export const CdsFolderFuncTreePage = withSuspense(
  lazy(
    () => import('@/features/digital-transform/pages/cds-folder-func-tree/CdsFolderFuncTreePage'),
  ),
)
export const CdsDeletedDocsPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-deleted-docs/CdsDeletedDocsPage')),
)
export const CdsSubFrontUserPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-front-user-sub/CdsSubFrontUserPage')),
)
export const CdsFrontGroupPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-front-group/CdsFrontGroupPage')),
)
export const CdsTeamListPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-team-list/CdsTeamListPage')),
)
export const CdsProjectListPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-project-list/CdsProjectListPage')),
)
export const CdsPhaseListPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-phase-list/CdsPhaseListPage')),
)
export const CdsFeatureListPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-feature-list/CdsFeatureListPage')),
)
export const CdsTaskListPage = withSuspense(
  lazy(() => import('@/features/digital-transform/pages/cds-task-list/CdsTaskListPage')),
)
