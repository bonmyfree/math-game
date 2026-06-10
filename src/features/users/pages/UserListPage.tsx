import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type CellContext,
} from '@tanstack/react-table'
import { Users, Search, ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { UserInfo } from '@/shared/types'
import { cn } from '@/shared/utils'

import { UserCreateModal } from '../components/UserCreateModal'

/**
 * Mock data CH? t?n t?i trong dev build.
 * Vite/esbuild thay `import.meta.env.DEV` -> `false` ? production vù dead-code-eliminate
 * toùn b? literal m?ng du?i dùy ù bundle prod ch? cùn `[]`.
 */
const MOCK_USERS: UserInfo[] = import.meta.env.DEV
  ? [
      {
        id: '1',
        fullName: 'Nguy?n Van A',
        email: 'nguyenvana@email.com',
        role: 'Admin',
        status: 'active',
        username: '',
      },
      {
        id: '2',
        fullName: 'Tr?n Th? B',
        email: 'tranthib@email.com',
        role: 'Editor',
        status: 'active',
        username: '',
      },
      {
        id: '3',
        fullName: 'Lù Van C',
        email: 'levanc@email.com',
        role: 'Viewer',
        status: 'inactive',
        username: '',
      },
      {
        id: '4',
        fullName: 'Ph?m Th? D',
        email: 'phamthid@email.com',
        role: 'Editor',
        status: 'active',
        username: '',
      },
      {
        id: '5',
        fullName: 'Hoùng Van E',
        email: 'hoangvane@email.com',
        role: 'Viewer',
        status: 'active',
        username: '',
      },
      {
        id: '6',
        fullName: 'Vu Th? F',
        email: 'vuthif@email.com',
        role: 'Admin',
        status: 'inactive',
        username: '',
      },
    ]
  : []

const columnHelper = createColumnHelper<UserInfo>()

function userFullNameCell(info: CellContext<UserInfo, string>) {
  const v = info.getValue()
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
        {v.split(' ').pop()?.charAt(0) || '?'}
      </div>
      <span className="font-medium text-slate-800">{v}</span>
    </div>
  )
}

function userEmailCell(info: CellContext<UserInfo, string>) {
  return <span className="text-slate-500 text-sm">{info.getValue()}</span>
}

function userRoleCell(info: CellContext<UserInfo, string>) {
  return (
    <span
      className={cn(
        'px-2.5 py-1 rounded-full text-xs font-medium',
        info.getValue() === 'Admin'
          ? 'bg-purple-100 text-purple-700'
          : info.getValue() === 'Editor'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-slate-100 text-slate-600',
      )}
    >
      {info.getValue()}
    </span>
  )
}

function userStatusCell(info: CellContext<UserInfo, UserInfo['status']>) {
  const v = info.getValue() ?? 'inactive'
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium',
        v === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600',
      )}
    >
      <span
        className={cn('w-1.5 h-1.5 rounded-full', v === 'active' ? 'bg-emerald-500' : 'bg-red-400')}
      />
      {v}
    </span>
  )
}

function UserRowActions() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
      >
        {t('common.edit')}
      </button>
      <button
        type="button"
        className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
      >
        {t('common.delete')}
      </button>
    </div>
  )
}

function userListActionCell(_info: CellContext<UserInfo, unknown>) {
  return <UserRowActions />
}

function createUserListColumns(actionsHeader: string) {
  return [
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      cell: userFullNameCell,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: userEmailCell,
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: userRoleCell,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: userStatusCell,
    }),
    columnHelper.display({
      id: 'actions',
      header: actionsHeader,
      cell: userListActionCell,
    }),
  ]
}

export function UserListPage() {
  const { t } = useTranslation()
  const [createOpen, setCreateOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // --- TanStack Query fetch users -------------------------------------------
  // const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
  //   queryKey: ['users'],
  //   queryFn: () => userApi.getAll(),
  //   select: (res) => res.data,
  // })
  const data = null,
    isLoading = false,
    isFetching = false

  const actionsHeader = t('common.actions')
  const columns = useMemo(() => createUserListColumns(actionsHeader), [actionsHeader])

  const tableData = useMemo(() => data ?? MOCK_USERS, [data])

  // --- TanStack Table -------------------------------------------------------
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API
  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  // --- Loading state --------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-slate-500">
        <Loader2 size={20} className="animate-spin" />
        <span>{t('common.loading')}</span>
      </div>
    )
  }

  // --- Error state ----------------------------------------------------------
  // if (isError) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-64 gap-4">
  //       <div className="flex items-center gap-2 text-red-500">
  //         <AlertCircle size={20} />
  //         <span className="text-sm font-medium">
  //           {(error as { message?: string })?.message || 'Khùng th? t?i d? li?u'}
  //         </span>
  //       </div>
  //       <button
  //         onClick={() => refetch()}
  //         className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
  //       >
  //         <RefreshCw size={14} />
  //         Th? l?i
  //       </button>
  //     </div>
  //   )
  // }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users size={22} className="text-blue-500" />
        <h1 className="text-xl font-bold text-slate-800">{t('nav.userList')}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={t('form.search') + '...'}
              className="h-9 w-64 rounded-lg border border-slate-200 pl-9 pr-3 py-0 text-sm leading-5 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Refetch indicator */}
            {isFetching && !isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Loader2 size={12} className="animate-spin" />
                ùang c?p nh?t...
              </div>
            )}

            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {t('common.create')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        'text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider',
                        header.column.getCanSort() &&
                          'cursor-pointer select-none hover:text-slate-700',
                      )}
                    >
                      <span className="flex items-center gap-1">
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
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              ?
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              ?
            </button>
          </div>
        </div>
      </div>

      <UserCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
