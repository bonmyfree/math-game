import { MutationCache, QueryCache, QueryClient, type DefaultOptions } from '@tanstack/react-query'

import { toastService } from '@/shared/services/toast.service'
import type { ApiError } from '@/shared/types'

function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') return false
  const e = error as Partial<ApiError>
  return typeof e.code === 'number' && typeof e.message === 'string' && e.success === false
}

function handleReactQueryError(error: unknown) {
  if (!isApiError(error)) return

  // Avoid noisy UX for auth redirect flows; interceptor will clear auth + ProtectedRoute redirects.
  if (error.code === 401) return

  toastService.fromApiResponse(error.code, error.message)
}

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (isApiError(error) && (error.code === 401 || error.code === 403)) return false
      return failureCount < 1
    },
  },
  mutations: {
    /* Align with query stale window: keep mutation results in cache briefly for devtools/consistency */
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (isApiError(error) && (error.code === 401 || error.code === 403)) return false
      return failureCount < 1
    },
  },
}

export const queryClient = new QueryClient({
  defaultOptions,
  queryCache: new QueryCache({
    onError: handleReactQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleReactQueryError,
  }),
})
