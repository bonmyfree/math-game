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

// Home
export const HomePage = withSuspense(lazy(() => import('@/features/home/pages/HomePage')))

// Games
export const GameListPage = withSuspense(lazy(() => import('@/features/games/pages/GameListPage')))
export const CountingGamePage = withSuspense(
  lazy(() => import('@/features/games/pages/CountingGamePage')),
)
export const AdditionGamePage = withSuspense(
  lazy(() => import('@/features/games/pages/AdditionGamePage')),
)
export const SubtractionGamePage = withSuspense(
  lazy(() => import('@/features/games/pages/SubtractionGamePage')),
)
export const CompareGamePage = withSuspense(
  lazy(() => import('@/features/games/pages/CompareGamePage')),
)
export const ShapesGamePage = withSuspense(
  lazy(() => import('@/features/games/pages/ShapesGamePage')),
)
export const QuizGamePage = withSuspense(lazy(() => import('@/features/games/pages/QuizGamePage')))
export const PlayGamePage = withSuspense(lazy(() => import('@/features/games/pages/PlayGamePage')))
export const ChallengeGamePage = withSuspense(
  lazy(() => import('@/features/games/pages/ChallengeGamePage')),
)
// Game tổng hợp cho các lớp 2–5 (đọc `grade` từ route param).
export const GradePlayPage = withSuspense(
  lazy(() => import('@/features/games/pages/GradePlayPage')),
)
export const GradeChallengePage = withSuspense(
  lazy(() => import('@/features/games/pages/GradeChallengePage')),
)
export const GradeFightingPage = withSuspense(
  lazy(() => import('@/features/games/pages/GradeFightingPage')),
)
export const FireworksShowcasePage = withSuspense(
  lazy(() => import('@/features/games/pages/FireworksShowcasePage')),
)

// Feature menus (placeholder template pages)
export const DocumentsPage = withSuspense(
  lazy(() => import('@/features/documents/pages/DocumentsPage')),
)
export const RanksPage = withSuspense(lazy(() => import('@/features/ranks/pages/RanksPage')))
export const HomeworkPage = withSuspense(
  lazy(() => import('@/features/homework/pages/HomeworkPage')),
)
export const ExchangeCoinsPage = withSuspense(
  lazy(() => import('@/features/exchange/pages/ExchangeCoinsPage')),
)
export const SettingsPage = withSuspense(
  lazy(() => import('@/features/settings/pages/SettingsPage')),
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
