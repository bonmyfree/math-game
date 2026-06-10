import { RotateCcw, Search } from 'lucide-react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/utils'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type SearchButtonResetVariant = 'ghost' | 'toolbar'

export type SearchButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Nếu không truyền `children`, dùng `label` hoặc bản dịch `form.search`. */
  label?: ReactNode
  /** Khi truyền: hiển thị nút reset bên cạnh (ví dụ chỉ truyền khi form đang có filter). */
  onReset?: () => void
  resetTitle?: string
  /**
   * Kiểu nút reset: `ghost` (nền trong suốt, hover xám — form filter chi tiết), `toolbar` (viền — `TableSearchBar`).
   * @default 'ghost'
   */
  resetVariant?: SearchButtonResetVariant
}

export const SearchButton = forwardRef<HTMLButtonElement, SearchButtonProps>(function SearchButton(
  {
    className,
    children,
    label,
    type = 'submit',
    disabled,
    onReset,
    resetTitle,
    resetVariant = 'ghost',
    ...rest
  },
  ref,
) {
  const { t } = useTranslation()
  const text = children ?? label ?? t('form.search')
  const isToolbarReset = resetVariant === 'toolbar'
  const resetBtnTitle = resetTitle ?? (isToolbarReset ? t('form.resetTitle') : t('common.reset'))
  const resetBtnAria = resetTitle ?? (isToolbarReset ? t('form.resetAria') : t('common.reset'))

  const searchBtn = (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        'group inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 cursor-pointer transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      <Search
        size={14}
        className="shrink-0 text-blue-100 transition-colors group-hover:text-white"
      />
      {text}
    </button>
  )

  if (!onReset) {
    return searchBtn
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {searchBtn}
      <button
        type="button"
        onClick={onReset}
        title={resetBtnTitle}
        aria-label={resetBtnAria}
        className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:border-blue-200 hover:bg-slate-50 hover:text-blue-600"
      >
        <RotateCcw size={14} />
      </button>
    </span>
  )
})

SearchButton.displayName = 'SearchButton'
