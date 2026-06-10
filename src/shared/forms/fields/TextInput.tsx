import { cn } from '@/shared/utils'

import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
  leftIcon?: ReactNode
  tone?: 'dark' | 'light'
}

export function TextInput({ hasError, leftIcon, tone = 'dark', className, ...props }: Props) {
  const base =
    tone === 'dark'
      ? 'bg-white/5 text-white placeholder:text-slate-600 border-white/10 hover:border-white/20'
      : 'bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 hover:border-slate-300'

  return (
    <div className="relative">
      {leftIcon ? (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{leftIcon}</span>
      ) : null}
      <input
        {...props}
        className={cn(
          'h-9 w-full rounded-lg border text-sm leading-5 py-0',
          base,
          'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all',
          leftIcon ? 'pl-9 pr-3' : 'px-3',
          hasError ? 'border-red-500/50' : undefined,
          className,
        )}
      />
    </div>
  )
}
