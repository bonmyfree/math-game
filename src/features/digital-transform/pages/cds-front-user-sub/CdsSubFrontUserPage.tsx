import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cdsService } from '@/features/digital-transform/services'
import type {
  CdsFrontUserData,
  CdsFrontUserListPayload,
} from '@/features/digital-transform/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { FormSearchKeyword } from '@/shared/components/list/FormSearchKeyword'
import { rowTextCell, statusCell, textCell } from '@/shared/components/table/listTableCells'
import { AddButton } from '@/shared/components/ui/AddButton'
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
import { useTableRowSelection } from '@/shared/hooks/useTableRowSelection'
import PageGuard from '@/shared/pages/PageGuard'
import { toastService } from '@/shared/services/toast.service'

import { DEFAULT_CDS_FRONT_USER_PAYLOAD } from './constants'
import { companyLabel, fullName, rowId, userDisplayCode } from './rowAccessors'
import { CDS_RIGHT } from '../../routes/constant'

/** Chuy?n ??i s? > Ng??i d?ng Front C?S */
export default function CdsSubFrontUserPage() {
  const { canView, canUpdate } = usePermission(CDS_RIGHT.SUB_FRONT_USER)
  const { t } = useTranslation()

  const [submittedPayload, setSubmittedPayload] = useState<CdsFrontUserListPayload>(
    DEFAULT_CDS_FRONT_USER_PAYLOAD,
  )
  const [currentPage, setCurrentPage] = useState(DEFAULT_CDS_FRONT_USER_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_CDS_FRONT_USER_PAYLOAD.RECORD_PER_PAGE)

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cdsFrontUsers', submittedPayload],
    queryFn: () => cdsService.getAllFrontUsers(submittedPayload),
    enabled: canView,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  const pageIds = useMemo(() => rows.map(rowId), [rows])
  const {
    selectedIds,
    selectAllRef,
    allCurrentSelected,
    selectAllIndeterminate,
    toggleSelectAll,
    toggleRow,
    clearSelection,
  } = useTableRowSelection(pageIds)

  const handleAdd = useCallback(() => {
    if (!canUpdate) return
    toastService.warning(t('cdsFrontUser.createNotImplemented'))
  }, [canUpdate, t])

  const handleView = useCallback(
    (row: CdsFrontUserData) => {
      toastService.warning(t('cdsFrontUser.viewNotImplemented', { code: userDisplayCode(row) }))
    },
    [t],
  )

  const handleDelete = useCallback(
    (row: CdsFrontUserData) => {
      if (!canUpdate) return
      if (!window.confirm(t('cdsFrontUser.confirmDelete', { code: userDisplayCode(row) }))) {
        return
      }
      toastService.warning(t('cdsFrontUser.deleteNotImplemented'))
    },
    [canUpdate, t],
  )

  const handleReset = useCallback(() => {
    setCurrentPage(1)
    clearSelection()
    setSubmittedPayload({ ...DEFAULT_CDS_FRONT_USER_PAYLOAD })
  }, [clearSelection])

  const handleSearch = useCallback(
    (keyword: string) => {
      setCurrentPage(1)
      clearSelection()
      setSubmittedPayload({ CODE: keyword, NAME: '', PAGE: 1, RECORD_PER_PAGE: pageSize })
    },
    [clearSelection, pageSize],
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

  const columnsDef = useMemo<ColumnDef<CdsFrontUserData>[]>(
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
            htmlFor="cds-front-user-select-all"
            className="flex min-h-10 w-full cursor-pointer select-none items-center justify-center rounded-sm hover:bg-slate-100/80"
          >
            <CheckboxInput
              id="cds-front-user-select-all"
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
          const inputId = `cds-front-user-select-${pk}`
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
        accessorKey: 'ROW_NUM',
        header: t('table.rowNum'),
        size: 72,
        cell: textCell,
      },
      {
        id: 'fullName',
        header: t('table.fullName'),
        size: 180,
        cell: rowTextCell(fullName),
      },
      {
        accessorKey: 'C_USER_NAME',
        header: t('table.username'),
        size: 140,
        cell: textCell,
      },
      {
        accessorKey: 'C_ROLE',
        header: t('table.role'),
        size: 120,
        cell: textCell,
      },
      {
        accessorKey: 'C_POSITION',
        header: t('table.position'),
        size: 140,
        cell: textCell,
      },
      {
        accessorKey: 'C_EMAIL',
        header: t('table.email'),
        size: 200,
        cell: textCell,
      },
      {
        id: 'company',
        header: t('table.company'),
        size: 160,
        cell: rowTextCell(companyLabel),
      },
      {
        accessorKey: 'C_CREATE_TIME',
        header: t('table.createTime'),
        size: 160,
        cell: textCell,
      },
      {
        accessorKey: 'C_STATUS',
        header: t('common.status'),
        size: 120,
        cell: ({ getValue }) => statusCell(getValue(), t('common.active'), t('common.inactive')),
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
                  onClick={() => handleView(r)}
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
    [
      allCurrentSelected,
      canUpdate,
      canView,
      handleDelete,
      handleView,
      selectAllIndeterminate,
      selectAllRef,
      selectedIds,
      t,
      toggleRow,
      toggleSelectAll,
    ],
  )

  const totalRecords =
    rows.length > 0 && rows[0].C_TOTAL_RECORD != null ? Number(rows[0].C_TOTAL_RECORD) : 0

  return (
    <PageGuard functionCode={CDS_RIGHT.SUB_FRONT_USER}>
      <div className="m-4">
        <PageToolbar>
          <FormSearchKeyword onSubmit={handleSearch} onReset={handleReset} />
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
          <Pagination
            page={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            recordPerPage={pageSize}
            total={totalRecords}
          />
        </>
      </QueryState>
    </PageGuard>
  )
}
