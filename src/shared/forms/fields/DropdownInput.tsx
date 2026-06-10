import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/shared/utils'

import type { FocusEventHandler, ReactNode } from 'react'

export type DropdownOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

type Props = {
  value?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  options: DropdownOption[]
  hasError?: boolean
  tone?: 'dark' | 'light'
  onChange?: (value: string) => void
  onBlur?: FocusEventHandler<HTMLButtonElement>
  className?: string
}

export function DropdownInput({
  value,
  placeholder,
  disabled,
  name,
  options,
  hasError,
  tone = 'dark',
  className,
  onChange,
  onBlur,
}: Props) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(240)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onMouseDown)
    return () => window.removeEventListener('mousedown', onMouseDown)
  }, [])

  useEffect(() => {
    if (!open || !rootRef.current) return

    const updatePlacement = () => {
      if (!rootRef.current) return

      const rect = rootRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const safeGap = 8
      const spaceBelow = Math.max(0, viewportHeight - rect.bottom - safeGap)
      const spaceAbove = Math.max(0, rect.top - safeGap)
      const preferredHeight = Math.min(options.length * 36 + 8, 240)
      // Always open toward the side that has more room
      const shouldOpenUpward = spaceAbove > spaceBelow
      const availableHeight = shouldOpenUpward ? spaceAbove : spaceBelow

      setOpenUpward(shouldOpenUpward)
      setDropdownMaxHeight(Math.max(120, Math.min(preferredHeight, availableHeight)))
    }

    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)
    return () => {
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement, true)
    }
  }, [open, options.length])

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value])

  const base =
    tone === 'dark'
      ? 'bg-white/5 text-white border-white/10 hover:border-white/20'
      : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'

  const shape =
    tone === 'light'
      ? 'h-9 rounded-lg py-0 border text-sm leading-5'
      : 'h-9 rounded-lg py-0 border text-sm leading-5'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        name={name}
        disabled={disabled}
        onBlur={onBlur}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev)
        }}
        className={cn(
          'w-full px-3 flex items-center justify-between',
          shape,
          base,
          'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all',
          hasError ? 'border-red-500/50' : undefined,
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          className,
        )}
      >
        <span className="truncate text-left">
          {selected?.label ?? <span className="text-slate-400">{placeholder}</span>}
        </span>
        <ChevronDown
          size={16}
          className={cn('ml-2 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <div
          className={cn(
            'absolute z-50 w-full overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1',
          )}
          style={{ maxHeight: `${dropdownMaxHeight}px` }}
          onWheel={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                if (option.disabled) return
                onChange?.(option.value)
                setOpen(false)
              }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm',
                option.value === value
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50',
                option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
