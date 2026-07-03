import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

import { MainLayout } from '@/shared/components/layout/MainLayout'
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute'
import NotFoundPage from '@/shared/pages/NotFoundPage'

import {
  HomePage,
  GameListPage,
  CountingGamePage,
  AdditionGamePage,
  SubtractionGamePage,
  CompareGamePage,
  ShapesGamePage,
  QuizGamePage,
  PlayGamePage,
  ChallengeGamePage,
  GradePlayPage,
  GradeChallengePage,
  FireworksShowcasePage,
  DocumentsPage,
  RanksPage,
  HomeworkPage,
  ExchangeCoinsPage,
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

// Game cụ thể (Lớp 1). Dùng đường dẫn 2 đoạn để không trùng `/games/$grade`.
const countingGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/counting',
  component: CountingGamePage,
})

const additionGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/addition',
  component: AdditionGamePage,
})

const subtractionGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/subtraction',
  component: SubtractionGamePage,
})

const compareGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/compare',
  component: CompareGamePage,
})

const shapesGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/shapes',
  component: ShapesGamePage,
})

const quizGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/quiz',
  component: QuizGamePage,
})

// Game tổng hợp tăng dần độ khó (thể loại "Kéo thả").
const playGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/play',
  component: PlayGamePage,
})

// Game thử thách (trắc nghiệm A/B/C/D, đếm giờ + mạng).
const challengeGameRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/1/challenge',
  component: ChallengeGamePage,
})

// Game tổng hợp cho các lớp 2–5 (route param). Đường dẫn tĩnh của Lớp 1 ở trên
// vẫn được ưu tiên khớp trước các route param này.
const gradePlayRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/$grade/play',
  component: GradePlayPage,
})

const gradeChallengeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/$grade/challenge',
  component: GradeChallengePage,
})

// Trang xem & chọn hiệu ứng pháo hoa ăn mừng.
const fireworksShowcaseRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/games/fireworks',
  component: FireworksShowcasePage,
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

const exchangeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/exchange',
  component: ExchangeCoinsPage,
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
    countingGameRoute,
    additionGameRoute,
    subtractionGameRoute,
    compareGameRoute,
    shapesGameRoute,
    quizGameRoute,
    playGameRoute,
    challengeGameRoute,
    gradePlayRoute,
    gradeChallengeRoute,
    fireworksShowcaseRoute,
    documentsRoute,
    ranksRoute,
    homeworkRoute,
    exchangeRoute,
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
