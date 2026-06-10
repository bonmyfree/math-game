import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { systemService } from '@/features/system/services'
import type {
  BackUserData,
  BackUserListPayload,
  BackUserListSearchKeys,
} from '@/features/system/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { textCell } from '@/shared/components/table/listTableCells'
import { AddButton } from '@/shared/components/ui/AddButton'
import { Button } from '@/shared/components/ui/button'
import { DataTable } from '@/shared/components/ui/DataTable'
import {
  TABLE_ACTION_CELL_CLASS,
  TABLE_ACTION_COL_META,
  TABLE_ACTION_COL_WIDTH_TWO_ICONS,
} from '@/shared/components/ui/dataTable.constants'
import Pagination from '@/shared/components/ui/Pagination'
import { QueryState } from '@/shared/components/ui/QueryState'
import { CheckboxInput } from '@/shared/forms/fields/CheckboxInput'
import { usePermission } from '@/shared/hooks/usePermission'
import PageGuard from '@/shared/pages/PageGuard'
import { toastService } from '@/shared/services/toast.service'
import { useModalStore } from '@/shared/stores/modal.store'
import { cn } from '@/shared/utils'

import { BackUserAccountDetail } from './components/BackUserAccountDetail'
import { FormSearchBackUserAccounts } from './components/FormSearchBackUserAccounts'
import { DEFAULT_BACK_USER_LIST_PAYLOAD } from './constants'
import { deleteConfirmCode, rowId } from './rowAccessors'
import { SYSTEM_RIGHT } from '../../routes/constant'

/** H? th?ng > Ngu?i d?ng Back > Danh s?ch ngu?i d?ng Back (BACK.GET_ALL_USER) */
export default function BackUserAccountsPage() {
  const { canView, canUpdate } = usePermission(SYSTEM_RIGHT.SUB_BACK_USER)
  const { t } = useTranslation()
  const { openModal } = useModalStore()

  const [submittedPayload, setSubmittedPayload] = useState<BackUserListPayload>(
    DEFAULT_BACK_USER_LIST_PAYLOAD,
  )
  const [currentPage, setCurrentPage] = useState(DEFAULT_BACK_USER_LIST_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_BACK_USER_LIST_PAYLOAD.RECORD_PER_PAGE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const selectAllRef = useRef<HTMLInputElement>(null)

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['backUsers', submittedPayload],
    queryFn: () => systemService.getAllBackUsers(submittedPayload),
    enabled: canView,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  const pageIds = useMemo(() => rows.map(rowId), [rows])
  const allCurrentSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))
  const someOnPage = pageIds.some((id) => selectedIds.has(id))

  const selectAllIndeterminate = someOnPage && !allCurrentSelected

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const allSelected =
        pageIds.length > 0 && pageIds.every((id) => prev.has(id))
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id))
      } else {
        pageIds.forEach((id) => next.add(id))
      }
      return next
    })
  }, [pageIds])

  const toggleRow = useCallback((pk: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(pk)
      else next.delete(pk)
      return next
    })
  }, [])

  const handleView = useCallback(
    (row: BackUserData) => {
      openModal({
        title: 'modal.backUserAccount.detailTitle',
        size: 'md',
        className: 'text-sm',
        children: <BackUserAccountDetail row={row} />,
      })
    },
    [openModal],
  )

  const handleDelete = useCallback(
    (row: BackUserData) => {
      if (!canUpdate) {
        toastService.warning(t('common.permissionDenied'))
        return
      }
      if (
        !window.confirm(
          t('backUserAccount.confirmDelete', { code: deleteConfirmCode(row) }),
        )
      ) {
        return
      }
      toastService.warning(t('backUserAccount.deleteNotImplemented'))
    },
    [canUpdate, t],
  )

  const handleBulkDelete = useCallback(() => {
    const count = selectedIds.size
    if (count === 0) return
    if (!window.confirm(t('backUserAccount.confirmBulkDelete', { count }))) return
    toastService.warning(t('backUserAccount.deleteNotImplemented'))
  }, [selectedIds, t])

  const handleAdd = useCallback(() => {
    if (!canUpdate) return
    toastService.warning(t('backUserAccount.createNotImplemented'))
  }, [canUpdate, t])

  const handleReset = useCallback(() => {
    setCurrentPage(1)
    setSelectedIds(new Set())
    setSubmittedPayload({ ...DEFAULT_BACK_USER_LIST_PAYLOAD })
  }, [])

  const handleSearch = useCallback(
    (values: BackUserListSearchKeys) => {
      setCurrentPage(1)
      setSelectedIds(new Set())
      setSubmittedPayload({ ...values, PAGE: 1, RECORD_PER_PAGE: pageSize })
    },
    [pageSize],
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    setSubmittedPayload((prev) => ({ ...prev, PAGE: page }))
  }, [])

  const handlePageSizeChange = useCallback((nextSize: number) => {
    setPageSize(nextSize)
    setCurrentPage(1)
    setSubmittedPayload((prev) => ({ ...prev, PAGE: 1, RECORD_PER_PAGE: nextSize }))
  }, [])

  const columnsDef = useMemo<ColumnDef<BackUserData>[]>(
    () => [
      {
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
            htmlFor="back-user-accounts-select-all"
            className="flex min-h-10 w-full cursor-pointer select-none items-center justify-center rounded-sm hover:bg-slate-100/80"
          >
            <CheckboxInput
              id="back-user-accounts-select-all"
              ref={selectAllRef}
              title={t('table.selectAll')}
              aria-label={t('table.selectAll')}
              checked={allCurrentSelected}
              indeterminate={selectAllIndeterminate}
              onCheckedChange={() => toggleSelectAll()}
            />
          </label>
        ),
        cell: ({ row }) => {
          const pk = rowId(row.original)
          const inputId = `back-user-accounts-select-${pk}`
          return (
            <label
              htmlFor={inputId}
              className="flex min-h-10 w-full cursor-pointer select-none items-center justify-center rounded-sm hover:bg-slate-100/80"
            >
              <CheckboxInput
                id={inputId}
                checked={selectedIds.has(pk)}
                title={t('table.selectRow')}
                aria-label={t('table.selectRow')}
                onCheckedChange={(next) => toggleRow(pk, next)}
              />
            </label>
          )
        },
      },
      {
        accessorKey: 'C_BACK_USER_CODE',
        header: t('table.loginCode'),
        cell: textCell,
      },
      {
        accessorKey: 'C_USER_NAME',
        header: t('table.userName'),
        cell: textCell,
      },
      {
        accessorKey: 'C_BRANCH_CODE',
        header: t('table.branchOffice'),
        cell: textCell,
      },
      {
        accessorKey: 'C_SUB_BRANCH_CODE',
        header: t('table.room'),
        cell: textCell,
      },
      {
        id: 'actions',
        header: t('common.action'),
        size: TABLE_ACTION_COL_WIDTH_TWO_ICONS,
        meta: TABLE_ACTION_COL_META,
        cell: ({ row }) => {
          if (!canView && !canUpdate) return null
          const r = row.original
          return (
            <div className={TABLE_ACTION_CELL_CLASS}>
              {canView ? (
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                  title={t('common.viewDetail')}
                  aria-label={t('common.viewDetail')}
                  onClick={() => handleView(r)}
                >
                  <Eye size={16} />
                </button>
              ) : null}
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                title={t('common.delete')}
                aria-label={t('common.delete')}
                onClick={() => handleDelete(r)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        },
      },
    ],
    [
      allCurrentSelected,
      selectAllIndeterminate,
      canUpdate,
      canView,
      handleDelete,
      handleView,
      selectedIds,
      t,
      toggleRow,
      toggleSelectAll,
    ],
  )

  const totalRecords =
    rows.length > 0 && rows[0].C_TOTAL_RECORD != null ? Number(rows[0].C_TOTAL_RECORD) : 0

  const selectedCount = selectedIds.size
  const showBulkDeleteFooter = canUpdate && selectedCount > 0

  return (
    <PageGuard functionCode={SYSTEM_RIGHT.SUB_BACK_USER}>
      <div className="m-4">
        <PageToolbar>
          <FormSearchBackUserAccounts onSubmit={handleSearch} onReset={handleReset} />
          {canUpdate ? <AddButton onClick={handleAdd} /> : null}
        </PageToolbar>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      >
        <>
          <DataTable data={rows} columns={columnsDef} isLoading={isFetching} pageSize={pageSize} />
          <div className={cn('flex', showBulkDeleteFooter ? 'justify-between' : 'justify-end')}>
            {showBulkDeleteFooter ? (
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <p className="text-sm text-slate-600">
                  {t('common.selectedCount', { count: selectedCount })}
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="inline-flex items-center gap-1.5"
                  onClick={handleBulkDelete}
                >
                  <Trash2 size={16} aria-hidden />
                  {t('common.delete')}
                </Button>
              </div>
            ) : null}
            <Pagination
              page={currentPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              recordPerPage={pageSize}
              total={totalRecords}
            />
          </div>
        </>
      </QueryState>
    </PageGuard>
  )
}
