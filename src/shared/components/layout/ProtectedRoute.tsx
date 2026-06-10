import { Navigate } from '@tanstack/react-router'

import { useAuthStore } from '@/shared/stores'

import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" />
  return <>{children}</>
}
