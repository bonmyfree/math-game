import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

import { MainLayout } from '@/shared/components/layout/MainLayout'
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute'
import NotFoundPage from '@/shared/pages/NotFoundPage'

import {
  HomePage,
  GameListPage,
  DocumentsPage,
  RanksPage,
  HomeworkPage,
  SettingsPage,
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
  component: HomePage,
})

const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/home',
  component: HomePage,
})

const gameListRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/$grade',
  component: GameListPage,
})

const documentsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/documents',
  component: DocumentsPage,
})

const ranksRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/ranks',
  component: RanksPage,
})

const homeworkRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/homework',
  component: HomeworkPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/settings',
  component: SettingsPage,
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
    homeRoute,
    gameListRoute,
    documentsRoute,
    ranksRoute,
    homeworkRoute,
    settingsRoute,
    profileRoute,
    changePasswordRoute,
    userListRoute,
    userRolesRoute,
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
