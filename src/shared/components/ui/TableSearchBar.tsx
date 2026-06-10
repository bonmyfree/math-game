import { useForm, type ReactFormExtendedApi } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'

import { SearchButton } from '@/shared/components/ui/SearchButton'
import { TextInput } from '@/shared/forms/fields/TextInput'
import { cn } from '@/shared/utils'

import type { ReactNode } from 'react'

/** Field mặc định cho chế độ một ô tìm kiếm (không truyền `children`). */
export type TableSearchKeywordValues = { keyword: string }

/** Form instance (Field, Subscribe, reset, handleSubmit, …) truyền vào `children`. */
/* eslint-disable @typescript-eslint/no-explicit-any -- Khớp validator generics mặc định của `useForm` (TanStack Form). */
export type TableSearchBarFormApi<TValues extends Record<string, unknown>> = ReactFormExtendedApi<
  TValues,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Tham số render slot `children` của `TableSearchBar` (có `children` tùy chỉnh). */
export type TableSearchBarSlotRenderArgs<TValues extends Record<string, unknown>> = {
  form: TableSearchBarFormApi<TValues>
  /** Nút Tìm kiếm + reset — chèn vào vị trí mong muốn trong hàng (ví dụ giữa field và checkbox). */
  searchControls: ReactNode
}

type BaseTableSearchBarProps = {
  placeholder?: string
  /** Khi có: nút reset chỉ `form.reset()` + gọi callback (không submit). Khi không: reset xong tự submit như cũ. */
  onReset?: () => void
  /** Gộp thêm class lên thẻ `<form>` (chế độ keyword và slot). */
  className?: string
}

type TableSearchBarKeywordProps = BaseTableSearchBarProps & {
  defaultValues: TableSearchKeywordValues
  onSearch: (values: TableSearchKeywordValues) => void
  children?: never
}

type TableSearchBarSlotProps<TValues extends Record<string, unknown>> = BaseTableSearchBarProps & {
  defaultValues: TValues
  onSearch: (values: TValues) => void
  children: (args: TableSearchBarSlotRenderArgs<TValues>) => ReactNode
}

export type TableSearchBarProps<
  TValues extends Record<string, unknown> = TableSearchKeywordValues,
> = TableSearchBarKeywordProps | TableSearchBarSlotProps<TValues>

function TableSearchBarKeywordOnly(props: TableSearchBarKeywordProps) {
  const { t } = useTranslation()
  const { placeholder = t('form.searchPlaceholder') } = props

  const form = useForm({
    defaultValues: props.defaultValues,
    onSubmit: async ({ value }) => {
      props.onSearch(value)
    },
  })

  return (
    <form
      className={cn(
        'flex w-fit max-w-full min-w-0 flex-wrap items-center gap-2 bg-white p-3 sm:gap-3',
        props.className,
      )}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <form.Field name="keyword">
          {(field) => (
            <div className="w-full max-w-sm min-w-[12rem] shrink-0">
              <TextInput
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={placeholder}
              />
            </div>
          )}
        </form.Field>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <SearchButton
          resetVariant="toolbar"
          onReset={() => {
            form.reset()
            if (props.onReset) {
              props.onReset()
            } else {
              void form.handleSubmit()
            }
          }}
        />
      </div>
    </form>
  )
}

function TableSearchBarWithChildren<TValues extends Record<string, unknown>>(
  props: TableSearchBarSlotProps<TValues>,
) {
  const { children, onReset, className } = props

  const form = useForm({
    defaultValues: props.defaultValues,
    onSubmit: async ({ value }) => {
      props.onSearch(value)
    },
  })

  const searchControls = (
    <div className="flex shrink-0 flex-nowrap items-center gap-2">
      <SearchButton
        resetVariant="toolbar"
        onReset={() => {
          form.reset()
          if (onReset) {
            onReset()
          } else {
            void form.handleSubmit()
          }
        }}
      />
    </div>
  )

  return (
    <form
      className={cn(
        'flex w-fit max-w-full min-w-0 flex-nowrap items-center gap-2 bg-white p-3 sm:gap-3',
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="flex min-w-0 flex-nowrap items-center gap-2">
        {children({ form, searchControls })}
      </div>
    </form>
  )
}

export function TableSearchBar<TValues extends Record<string, unknown> = TableSearchKeywordValues>(
  props: TableSearchBarProps<TValues>,
) {
  if ('children' in props && props.children) {
    return <TableSearchBarWithChildren {...(props as TableSearchBarSlotProps<TValues>)} />
  }
  return <TableSearchBarKeywordOnly {...(props as TableSearchBarKeywordProps)} />
}
