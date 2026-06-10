import { isValid, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Calendar } from '@/shared/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { cn, DATE_FORMAT, formatDate, parseDate } from '@/shared/utils/utils'

type DatePickerProps = {
  value?: string
  onChange: (date?: string) => void
  hasError?: boolean
  disabled?: boolean
  /** Khi không dùng label riêng (ví dụ form tìm kiếm compact). */
  ariaLabel?: string
}

function buildDisplay(digits: string): string {
  const dd = digits.slice(0, 2).padEnd(2, '_')
  const mm = digits.slice(2, 4).padEnd(2, '_')
  const yyyy = digits.slice(4, 8).padEnd(4, '_')
  return `${dd}/${mm}/${yyyy}`
}

function toCursorPos(len: number): number {
  if (len <= 1) return len
  if (len === 2) return 3 // nhảy qua / đầu
  if (len === 3) return 4
  if (len === 4) return 6 // nhảy qua / thứ 2
  return len + 2
}

function toDateString(digits: string): string {
  if (digits.length < 8) return ''
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
}

function valueToDigits(value?: string): string {
  return (value ?? '').replace(/\D/g, '').slice(0, 8)
}

export function DatePicker({ value, onChange, hasError, disabled, ariaLabel }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [digits, setDigits] = useState(() => valueToDigits(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDigits(valueToDigits(value))
  }, [value])

  useLayoutEffect(() => {
    if (focused && inputRef.current) {
      const pos = toCursorPos(digits.length)
      inputRef.current.setSelectionRange(pos, pos)
    }
  })

  const updateDigits = (newDigits: string) => {
    setDigits(newDigits)
    const dateStr = toDateString(newDigits)
    if (dateStr) {
      const parsed = parse(dateStr, DATE_FORMAT, new Date())
      onChange(isValid(parsed) ? dateStr : undefined)
    } else if (newDigits.length === 0) {
      onChange(undefined)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
    e.preventDefault()

    if (e.key === 'Backspace') {
      updateDigits(digits.slice(0, -1))
      return
    }

    if (e.key === '/') {
      // Pad 0 nếu user nhập / khi chưa đủ 2 số
      if (digits.length === 1) updateDigits('0' + digits[0])
      if (digits.length === 3) updateDigits(digits.slice(0, 2) + '0' + digits[2])
      // len=2 hoặc len=4: / đã có sẵn, cursor tự nhảy qua nhờ toCursorPos
      return
    }

    if (/^\d$/.test(e.key) && digits.length < 8) {
      updateDigits(digits + e.key)
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date instanceof Date && isValid(date)) {
      const formatted = formatDate(date, DATE_FORMAT)
      onChange(formatted)
      setDigits(valueToDigits(formatted))
    } else {
      onChange(undefined)
      setDigits('')
    }
    setOpen(false)
  }

  return (
    <div
      className={cn(
        'flex items-center h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm transition-all',
        'hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30',
        hasError && 'border-red-500',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="relative flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          aria-label={ariaLabel}
          value={digits.length > 0 ? buildDisplay(digits) : ''}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="absolute inset-0 bg-transparent outline-none"
          style={{ color: 'transparent', caretColor: 'black' }}
        />

        <span className="pointer-events-none select-none" aria-hidden>
          {!focused && digits.length === 0 ? (
            // Chưa focus, chưa gõ → placeholder gốc
            <span className="text-muted-foreground">{DATE_FORMAT}</span>
          ) : digits.length === 0 ? (
            // Focus nhưng chưa gõ → mask mờ
            <span className="text-muted-foreground/50">__/__/____</span>
          ) : (
            // Đang gõ → phần đã nhập + mask còn lại
            <>
              <span className="text-foreground">
                {buildDisplay(digits).slice(0, toCursorPos(digits.length))}
              </span>
              <span className="text-muted-foreground/50">
                {buildDisplay(digits).slice(toCursorPos(digits.length))}
              </span>
            </>
          )}
        </span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button type="button" className="cursor-pointer ml-1">
            <CalendarIcon size={16} className="text-orange-400 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="single" selected={parseDate(value)} onSelect={handleCalendarSelect} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
