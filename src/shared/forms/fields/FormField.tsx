import type { ReactNode } from 'react'

type Props = {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  tone?: 'dark' | 'light'
  children: ReactNode
}

export function FormField({ label, error, hint, required, tone = 'dark', children }: Props) {
  const labelClass = tone === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const hintClass = tone === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const errorClass = 'text-[#ff5555]'

  return (
    <div>
      {label ? (
        <label className={`block text-sm font-medium mb-1.5 ${labelClass}`}>
          {label} {required ? <span className="text-red-400">*</span> : null}
        </label>
      ) : null}

      {children}

      {hint && !error ? <p className={`text-xs mt-1 ${hintClass}`}>{hint}</p> : null}
      {error ? <p className={`mt-1 text-[0.75rem] ${errorClass}`}>{error}</p> : null}
    </div>
  )
}
