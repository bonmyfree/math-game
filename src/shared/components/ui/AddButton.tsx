import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/utils'

export type AddButtonProps = {
  onClick: () => void
  labelKey?: string
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function AddButton({
  onClick,
  labelKey = 'common.addNew',
  disabled,
  className,
  type = 'button',
}: AddButtonProps) {
  const { t } = useTranslation()
  const label = t(labelKey)

  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-600 bg-white px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white active:border-blue-700 active:bg-blue-700 active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      <span className="inline-flex shrink-0" aria-hidden>
        <Plus size={18} strokeWidth={2} />
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}
