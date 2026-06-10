import { CheckboxInput } from '@/shared/forms/fields/CheckboxInput'

import type { ColumnDef } from '@tanstack/react-table'
import type { RefObject } from 'react'

type SelectColumnOptions<T> = {
  idPrefix: string
  getRowId: (row: T) => string
  selectedIds: Set<string>
  selectAllRef: RefObject<HTMLInputElement | null>
  allCurrentSelected: boolean
  selectAllIndeterminate: boolean
  toggleSelectAll: () => void
  toggleRow: (id: string, checked: boolean) => void
  selectAllLabel: string
  selectRowLabel: string
}

export function createSelectColumn<T>({
  idPrefix,
  getRowId,
  selectedIds,
  selectAllRef,
  allCurrentSelected,
  selectAllIndeterminate,
  toggleSelectAll,
  toggleRow,
  selectAllLabel,
  selectRowLabel,
}: SelectColumnOptions<T>): ColumnDef<T> {
  return {
    id: 'select',
    size: 44,
    enableSorting: false,
    meta: {
      headerClassName:
        'w-11 min-w-11 max-w-11 shrink-0 px-2 text-center align-middle normal-case [&>span]:justify-center',
      cellClassName: 'w-11 min-w-11 max-w-11 shrink-0 px-2 align-middle',
    },
    header: () => (
      <label
        htmlFor={`${idPrefix}-select-all`}
        className="flex min-h-10 w-full cursor-pointer select-none items-center justify-center rounded-sm hover:bg-slate-100/80"
      >
        <CheckboxInput
          id={`${idPrefix}-select-all`}
          ref={selectAllRef}
          title={selectAllLabel}
          aria-label={selectAllLabel}
          checked={allCurrentSelected}
          indeterminate={selectAllIndeterminate}
          onCheckedChange={() => toggleSelectAll()}
        />
      </label>
    ),
    cell: ({ row }) => {
      const pk = getRowId(row.original)
      const inputId = `${idPrefix}-select-${pk}`
      return (
        <label
          htmlFor={inputId}
          className="flex min-h-10 w-full cursor-pointer select-none items-center justify-center rounded-sm hover:bg-slate-100/80"
        >
          <CheckboxInput
            id={inputId}
            checked={selectedIds.has(pk)}
            title={selectRowLabel}
            aria-label={selectRowLabel}
            onCheckedChange={(next) => toggleRow(pk, next)}
          />
        </label>
      )
    },
  }
}
