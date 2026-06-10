import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { systemService } from '@/features/system/services'
import type {
  CommonCategoryData,
  CommonCategoryListPayload,
  CommonCategorySearchKeys,
} from '@/features/system/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { lineClampTextCell, textCell } from '@/shared/components/table/listTableCells'
import { createSelectColumn } from '@/shared/components/table/selectColumn'
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
import { usePermission } from '@/shared/hooks/usePermission'
import { useTableRowSelection } from '@/shared/hooks/useTableRowSelection'
import PageGuard from '@/shared/pages/PageGuard'
import { toastService } from '@/shared/services/toast.service'
import { useModalStore } from '@/shared/stores/modal.store'
import { cn } from '@/shared/utils'

import { CommonCategoryDetail } from './components/CommonCategoryDetail'
import { FormSearchCommonCategory } from './components/FormSearchCommonCategory'
import { COMMON_CATEGORY_GROUP, DEFAULT_COMMON_CATEGORY_PAYLOAD } from './constants'
import { categoryDisplayLabel, rowId } from './rowAccessors'
import { SYSTEM_RIGHT } from '../../routes/constant'

/** H? th?ng > Danh m?c > Danh m?c chung (BACK.GET_ALL_LISTTYPE) */
export default function CommonCategoryPage() {
  const { canView, canUpdate } = usePermission(SYSTEM_RIGHT.COMMON_CATEGORY)
  const { t } = useTranslation()
  const { openModal } = useModalStore()

  const [submittedPayload, setSubmittedPayload] = useState<CommonCategoryListPayload>(
    DEFAULT_COMMON_CATEGORY_PAYLOAD,
  )
  const [currentPage, setCurrentPage] = useState(DEFAULT_COMMON_CATEGORY_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_COMMON_CATEGORY_PAYLOAD.RECORD_PER_PAGE)

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['commonCategories', submittedPayload],
    queryFn: () => systemService.getAllListTypes(submittedPayload),
    enabled: canView,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  const pageIds = useMemo(() => rows.map(rowId), [rows])
  const selection = useTableRowSelection(pageIds)

  const handleAdd = useCallback(() => {
    if (!canUpdate) return
    toastService.warning(t('commonCategory.createNotImplemented'))
  }, [canUpdate, t])

  const handleViewDetail = useCallback(
    (row: CommonCategoryData) => {
      openModal({
        title: 'modal.commonCategory.detailTitle',
        size: 'md',
        className: 'text-sm',
        children: <CommonCategoryDetail row={row} />,
      })
    },
    [openModal],
  )

  const handleDelete = useCallback(
    (row: CommonCategoryData) => {
      if (!canUpdate) return
      if (!window.confirm(t('commonCategory.confirmDelete', { code: categoryDisplayLabel(row) }))) {
        return
      }
      toastService.warning(t('commonCategory.deleteNotImplemented'))
    },
    [canUpdate, t],
  )

  const handleBulkDelete = useCallback(() => {
    const count = selection.selectedCount
    if (count === 0) return
    if (!window.confirm(t('commonCategory.confirmBulkDelete', { count }))) return
    toastService.warning(t('commonCategory.deleteNotImplemented'))
  }, [selection.selectedCount, t])

  const handleReset = useCallback(() => {
    setCurrentPage(1)
    selection.clearSelection()
    setSubmittedPayload({ ...DEFAULT_COMMON_CATEGORY_PAYLOAD })
  }, [selection])

  const handleSearch = useCallback(
    (values: CommonCategorySearchKeys) => {
      setCurrentPage(1)
      selection.clearSelection()
      setSubmittedPayload({ ...values, PAGE: 1, RECORD_PER_PAGE: pageSize })
    },
    [pageSize, selection],
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

  const columnsDef = useMemo<ColumnDef<CommonCategoryData>[]>(
    () => [
      createSelectColumn<CommonCategoryData>({
        idPrefix: 'common-category',
        getRowId: rowId,
        selectedIds: selection.selectedIds,
        selectAllRef: selection.selectAllRef,
        allCurrentSelected: selection.allCurrentSelected,
        selectAllIndeterminate: selection.selectAllIndeterminate,
        toggleSelectAll: selection.toggleSelectAll,
        toggleRow: selection.toggleRow,
        selectAllLabel: t('table.selectAll'),
        selectRowLabel: t('table.selectRow'),
      }),
      {
        accessorKey: 'C_CODE',
        header: t('table.categoryCode'),
        size: 140,
        cell: textCell,
      },
      {
        accessorKey: 'C_NAME',
        header: t('table.categoryName'),
        size: 240,
        cell: lineClampTextCell(),
      },
      {
        accessorKey: 'C_GROUP',
        header: t('table.group'),
        size: 160,
        cell: ({ getValue }) => {
          const group = String(getValue<string>() ?? '').toUpperCase()
          if (group === COMMON_CATEGORY_GROUP.USER) return t('commonCategory.search.groupUser')
          if (group === COMMON_CATEGORY_GROUP.SYSTEM) return t('commonCategory.search.groupSystem')
          if (!group) return null
          return <span>{group}</span>
        },
      },
      {
        accessorKey: 'C_ORDER',
        header: t('table.order'),
        size: 100,
        cell: textCell,
      },
      {
        accessorKey: 'C_STATUS',
        header: t('common.status'),
        size: 120,
        cell: ({ getValue }) => {
          const v = Number(getValue<number | string>())
          return <span>{v === 1 ? t('common.active') : t('common.inactive')}</span>
        },
      },
      {
        id: 'actions',
        header: t('common.action'),
        size: TABLE_ACTION_COL_WIDTH_TWO_ICONS,
        meta: TABLE_ACTION_COL_META,
        cell: ({ row }) => {
          const r = row.original
          if (!canView && !canUpdate) return null
          return (
            <div className={TABLE_ACTION_CELL_CLASS}>
              {canView ? (
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                  title={t('common.viewDetail')}
                  onClick={() => handleViewDetail(r)}
                >
                  <Eye size={16} />
                </button>
              ) : null}
              {canUpdate ? (
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  title={t('common.delete')}
                  onClick={() => handleDelete(r)}
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
          )
        },
      },
    ],
    [canUpdate, canView, handleDelete, handleViewDetail, selection, t],
  )

  const totalRecords =
    rows.length > 0 && rows[0].C_TOTAL_RECORD != null ? Number(rows[0].C_TOTAL_RECORD) : 0

  const selectedCount = selection.selectedCount
  const showBulkDeleteFooter = canUpdate && selectedCount > 0

  return (
    <PageGuard functionCode={SYSTEM_RIGHT.COMMON_CATEGORY}>
      <div className="m-4">
        <PageToolbar>
          <FormSearchCommonCategory onSubmit={handleSearch} onReset={handleReset} />
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
