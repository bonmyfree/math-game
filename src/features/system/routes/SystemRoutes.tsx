import { createRoute, redirect, type AnyRoute } from '@tanstack/react-router'

import {
  SystemLogPage,
  BackFunctionPage,
  BackUserGroupPage,
  BackUserAccountsPage,
  CommonCategoryPage,
  DepartmentBlockPage,
} from '@/app/lazyRoutes'
import { checkPermission } from '@/shared/hooks/usePermission'

import {
  SYS_BACK_USER_TABS,
  SYS_CATEGORY_TABS,
  SYS_DEPARTMENT_TABS,
  SYS_OPERATION_TABS,
  SYSTEM_PATH,
  SYSTEM_RIGHT,
  SYSTEM_TABS,
} from './constant'
import { BackUserLayout, CategoryLayout, DepartmentLayout } from '../layouts'
import { OperationLayout } from '../layouts/OperationLayout'
import { SystemLayout } from '../layouts/SystemLayout'

/**
 * Factory tạo subtree route cho feature `system`.
 *
 * Nhận parent route từ ngoài (do `app/router.tsx` cung cấp) thay vì import ngược
 * `appLayoutRoute` — phá circular dependency `app/router` ↔ `features/system/routes`.
 */
export function createSystemRoutes(parent: AnyRoute) {
  // System root — redirect vào tab đầu tiên user có quyền
  const systemRoot = createRoute({
    getParentRoute: () => parent,
    path: '/system',
    component: SystemLayout,
    beforeLoad: ({ location }) => {
      if (location.pathname !== '/system') return
      const first = SYSTEM_TABS.find(({ right }) => checkPermission(right))
      if (first) throw redirect({ to: first.path })
    },
  })

  // Vận hành hệ thống
  const operationRoute = createRoute({
    getParentRoute: () => systemRoot,
    path: '/operation',
    component: OperationLayout,
    beforeLoad: ({ location }) => {
      // Chặn user paste URL trực tiếp khi không đủ quyền.
      if (!checkPermission(SYSTEM_RIGHT.OPERATION)) throw redirect({ to: '/system' })

      if (location.pathname === SYSTEM_PATH.OPERATION) {
        const first = SYS_OPERATION_TABS.find(({ right }) => checkPermission(right))
        if (first) throw redirect({ to: first.path })
      }
    },
  })

  // Tra cứu log hệ thống
  const systemLogRoute = createRoute({
    getParentRoute: () => operationRoute,
    path: '/system-log',
    component: SystemLogPage,
    beforeLoad: () => {
      if (!checkPermission(SYSTEM_RIGHT.SYSTEM_LOG)) throw redirect({ to: SYSTEM_PATH.OPERATION })
    },
  })

  // Người dùng Back
  const backUserRoute = createRoute({
    getParentRoute: () => systemRoot,
    path: 'back-user',
    component: BackUserLayout,
    beforeLoad: ({ location }) => {
      // Check user có quyền vào tab người dùng back không? Nếu không redirect
      if (!checkPermission(SYSTEM_RIGHT.BACK_USER)) throw redirect({ to: '/system' })

      // Check location để ridirect vào tab con đầu tiên có quyền truy cập (mặc định là view)
      if (location.pathname === SYSTEM_PATH.BACK_USER) {
        const first = SYS_BACK_USER_TABS.find(({ right }) => checkPermission(right))
        if (first) throw redirect({ to: first.path })
      }
    },
  })

  const backFunctionRoute = createRoute({
    getParentRoute: () => backUserRoute,
    path: '/functions',
    component: BackFunctionPage,
    beforeLoad: () => {
      if (!checkPermission(SYSTEM_RIGHT.BACK_FUNCTION))
        throw redirect({ to: SYSTEM_PATH.BACK_USER })
    },
  })

  const backUserGroupRoute = createRoute({
    getParentRoute: () => backUserRoute,
    path: '/group',
    component: BackUserGroupPage,
    beforeLoad: () => {
      if (!checkPermission(SYSTEM_RIGHT.GROUP_USER)) throw redirect({ to: SYSTEM_PATH.BACK_USER })
    },
  })

  const backUserAccountsRoute = createRoute({
    getParentRoute: () => backUserRoute,
    path: '/users',
    component: BackUserAccountsPage,
    beforeLoad: () => {
      if (!checkPermission(SYSTEM_RIGHT.SUB_BACK_USER))
        throw redirect({ to: SYSTEM_PATH.BACK_USER })
    },
  })

  // Danh mục
  const categoriesRoute = createRoute({
    getParentRoute: () => systemRoot,
    path: 'categories',
    component: CategoryLayout,
    beforeLoad: ({ location }) => {
      if (!checkPermission(SYSTEM_RIGHT.CATEGORY)) throw redirect({ to: '/system' })

      if (location.pathname === SYSTEM_PATH.CATEGORIES) {
        const first = SYS_CATEGORY_TABS.find(({ right }) => checkPermission(right))
        if (first) throw redirect({ to: first.path })
      }
    },
  })

  const commonCategoryRoute = createRoute({
    getParentRoute: () => categoriesRoute,
    path: '/common',
    component: CommonCategoryPage,
    beforeLoad: () => {
      if (!checkPermission(SYSTEM_RIGHT.COMMON_CATEGORY))
        throw redirect({ to: SYSTEM_PATH.CATEGORIES })
    },
  })

  // Cấu trúc phòng ban
  const departmentRoute = createRoute({
    getParentRoute: () => systemRoot,
    path: 'department',
    component: DepartmentLayout,
    beforeLoad: ({ location }) => {
      if (!checkPermission(SYSTEM_RIGHT.DEPARTMENT)) throw redirect({ to: '/system' })

      if (location.pathname === SYSTEM_PATH.DEPARTMENT) {
        const first = SYS_DEPARTMENT_TABS.find(({ right }) => checkPermission(right))
        if (first) throw redirect({ to: first.path })
      }
    },
  })

  const departmentBlockRoute = createRoute({
    getParentRoute: () => departmentRoute,
    path: '/block',
    component: DepartmentBlockPage,
    beforeLoad: () => {
      if (!checkPermission(SYSTEM_RIGHT.BLOCK)) throw redirect({ to: SYSTEM_PATH.DEPARTMENT })
    },
  })

  return systemRoot.addChildren([
    operationRoute.addChildren([systemLogRoute]),
    backUserRoute.addChildren([backFunctionRoute, backUserGroupRoute, backUserAccountsRoute]),
    categoriesRoute.addChildren([commonCategoryRoute]),
    departmentRoute.addChildren([departmentBlockRoute]),
  ])
}
