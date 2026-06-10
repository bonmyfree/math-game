import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/shared/utils'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  hasError?: boolean
  leftIcon?: ReactNode
  tone?: 'dark' | 'light'
}

export function PasswordInput({ hasError, leftIcon, tone = 'dark', className, ...props }: Props) {
  const [visible, setVisible] = useState(false)

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
        type={visible ? 'text' : 'password'}
        className={cn(
          'h-9 w-full rounded-lg border text-sm leading-5 py-0',
          base,
          'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all',
          leftIcon ? 'pl-9 pr-10' : 'pl-3 pr-10',
          hasError ? 'border-red-500/50' : undefined,
          className,
        )}
      />

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
