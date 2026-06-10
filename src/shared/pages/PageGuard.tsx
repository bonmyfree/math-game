import { usePermission } from '@/shared/hooks/usePermission'

import ForbiddenPage from './ForbiddenPage'
import { cn } from '../utils'

export default function PageGuard({
  functionCode,
  children,
  className,
}: {
  functionCode: string
  children: React.ReactNode
  className?: string
}) {
  const { hasAnyRight } = usePermission(functionCode)
  const allowed =
    typeof hasAnyRight === 'boolean' ? hasAnyRight : hasAnyRight('view', 'update', 'approve')
  if (!allowed) {
    return <ForbiddenPage />
  }
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
