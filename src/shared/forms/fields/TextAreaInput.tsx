import { cn } from '@/shared/utils'

import type { ReactNode, TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean
  leftIcon?: ReactNode
  tone?: 'dark' | 'light'
}

export function TextAreaInput({ hasError, leftIcon, tone = 'dark', className, ...props }: Props) {
  const base =
    tone === 'dark'
      ? 'bg-white/5 text-white placeholder:text-slate-600 border-white/10 hover:border-white/20'
      : 'bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 hover:border-slate-300'

  return (
    <div className="relative">
      {leftIcon ? <span className="absolute left-3 top-3 text-slate-500">{leftIcon}</span> : null}
      <textarea
        {...props}
        className={cn(
          'w-full rounded-lg border py-2.5 text-sm',
          base,
          'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all',
          leftIcon ? 'pl-10 pr-4' : 'px-4',
          hasError ? 'border-red-500/50' : undefined,
          className,
        )}
      />
    </div>
  )
}
