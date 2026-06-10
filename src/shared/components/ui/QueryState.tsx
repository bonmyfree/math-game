import { AlertCircle, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageLoader } from './PageLoader'

import type { ReactNode } from 'react'

export { PageLoader as QueryLoading }

export interface QueryStateProps {
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry?: () => void
  children: ReactNode
}

/** Gộp loading / lỗi / nội dung khi query thành công — dùng chung cho các trang `useQuery`. */
export function QueryState({ isLoading, isError, error, onRetry, children }: QueryStateProps) {
  if (isLoading) {
    return <PageLoader />
  }
  if (isError) {
    return <QueryError error={error} onRetry={onRetry} />
  }
  return children
}

interface QueryErrorProps {
  error?: unknown
  onRetry?: () => void
}

export function QueryError({ error, onRetry }: QueryErrorProps) {
  const { t } = useTranslation()
  const message = (error as { message?: string })?.message || t('common.unableLoadData')

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <RefreshCw size={14} />
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}
