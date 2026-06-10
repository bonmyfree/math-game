import { Loader2 } from 'lucide-react'

import { cn } from '@/shared/utils'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
  loadingText?: ReactNode
}

export function FormSubmitButton({
  isLoading,
  loadingText,
  disabled,
  className,
  children,
  ...props
}: Props) {
  const isDisabled = disabled || isLoading

  return (
    <button
      {...props}
      type={props.type ?? 'submit'}
      disabled={isDisabled}
      className={cn(
        'w-full py-2.5 rounded-xl font-semibold text-sm transition-all',
        'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
        'hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-500/40',
        'disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2',
        className,
      )}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingText ?? 'Loading...'}
        </>
      ) : (
        children
      )}
    </button>
  )
}
