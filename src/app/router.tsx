import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

import { createDigitalTransformRoutes } from '@/features/digital-transform/routes/DigitalTransformRoutes'
import { createSystemRoutes } from '@/features/system/routes/SystemRoutes'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute'
import NotFoundPage from '@/shared/pages/NotFoundPage'

import {
  DashboardPage,
  LoginPage,
  ChangePasswordPage,
  ProfilePage,
  UserListPage,
  UserRolesPage,
} from './lazyRoutes'

// ─── Root Route ───────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: Outlet })

// ─── Auth Routes ──────────────────────────────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// ─── Protected Layout Route ───────────────────────────────────────────────────
// Nội bộ file — không export ra ngoài để tránh feature import ngược lại.
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: () => (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
})

// ─── App Routes (nested under layout) ────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: DashboardPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/account/profile',
  component: ProfilePage,
})

const changePasswordRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/account/change-password',
  component: ChangePasswordPage,
})

const userListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/users',
  component: UserListPage,
})

const userRolesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/user-roles',
  component: UserRolesPage,
})

// ─── Route Tree ───────────────────────────────────────────────────────────────
// Mỗi feature export factory `(parent) => Route` để app orchestrate ở đây.
const routeTree = rootRoute.addChildren([
  loginRoute,
  appLayoutRoute.addChildren([
    indexRoute,
    dashboardRoute,
    profileRoute,
    changePasswordRoute,
    userListRoute,
    userRolesRoute,
    createSystemRoutes(appLayoutRoute),
    createDigitalTransformRoutes(appLayoutRoute),
    // Other features...
  ]),
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFoundPage,
})

// Type-safe router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
