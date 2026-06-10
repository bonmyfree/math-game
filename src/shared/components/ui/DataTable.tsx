import {
  ColumnDef,
  flexRender,
  Table as TanstackTable,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/utils'

import { columnWidthStyle, type DataTableColumnMeta } from './dataTable.constants'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  isLoading?: boolean
  emptyText?: string
  pageSize?: number
  onTableReady?: (table: TanstackTable<TData>) => void
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  emptyText,
  pageSize,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: undefined,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const { t } = useTranslation()

  return (
    <div className="overflow-x-auto border border-y-gray-200 border-x-0">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined
                const width = header.column.columnDef.size
                return (
                  <th
                    key={header.id}
                    style={columnWidthStyle(width)}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={cn(
                      'text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider',
                      header.column.getCanSort() &&
                        'cursor-pointer select-none hover:text-slate-700',
                      meta?.headerClassName,
                    )}
                  >
                    <span
                      className={cn(
                        'flex w-full items-center gap-1',
                        meta?.headerClassName?.includes('text-center') && 'justify-center',
                      )}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() &&
                        (header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp size={13} />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown size={13} />
                        ) : (
                          <ChevronsUpDown size={13} className="opacity-40" />
                        ))}
                    </span>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-slate-50">
          {isLoading ? (
            Array.from({ length: pageSize ?? 10 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col, j) => {
                  const meta = col.meta as DataTableColumnMeta | undefined
                  return (
                    <td
                      key={j}
                      style={columnWidthStyle(col.size)}
                      className={cn('px-4 py-3', meta?.cellClassName)}
                    >
                      <div className="h-4 animate-pulse rounded bg-gray-200" />
                    </td>
                  )
                })}
              </tr>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-gray-400">
                {emptyText || t('common.emptyData')}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
                  const width = cell.column.columnDef.size
                  return (
                    <td
                      key={cell.id}
                      style={columnWidthStyle(width)}
                      className={cn('px-4 py-3', meta?.cellClassName)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
