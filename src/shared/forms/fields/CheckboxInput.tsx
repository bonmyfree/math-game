import { forwardRef, useLayoutEffect, useRef } from 'react'

import { cn } from '@/shared/utils'

import type { InputHTMLAttributes } from 'react'

type Props = Pick<InputHTMLAttributes<HTMLInputElement>, 'id' | 'onClick' | 'aria-label'> & {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (next: boolean) => void
  disabled?: boolean
  className?: string
  title?: string
}

export const CheckboxInput = forwardRef<HTMLInputElement, Props>(function CheckboxInput(
  {
    checked,
    indeterminate = false,
    onCheckedChange,
    disabled,
    className,
    title,
    id,
    onClick,
    'aria-label': ariaLabel,
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    el.indeterminate = indeterminate
  }, [indeterminate, checked])

  const setRef = (el: HTMLInputElement | null) => {
    innerRef.current = el
    if (typeof forwardedRef === 'function') {
      forwardedRef(el)
    } else if (forwardedRef) {
      forwardedRef.current = el
    }
  }

  return (
    <input
      ref={setRef}
      id={id}
      type="checkbox"
      title={title}
      aria-label={ariaLabel}
      checked={Boolean(checked)}
      disabled={disabled}
      onClick={onClick}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        'size-4 cursor-pointer rounded border-slate-300 text-blue-600',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    />
  )
})
