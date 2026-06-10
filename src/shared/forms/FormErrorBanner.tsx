import { AlertTriangle } from 'lucide-react'

import { cn } from '@/shared/utils'

type Props = {
  message?: string
  className?: string
}

export function FormErrorBanner({ message, className }: Props) {
  if (!message) return null

  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-200',
        className,
      )}
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-300" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
