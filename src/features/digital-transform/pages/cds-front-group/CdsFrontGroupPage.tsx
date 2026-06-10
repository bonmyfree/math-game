import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cdsService } from '@/features/digital-transform/services'
import type {
  CdsFrontGroupData,
  CdsFrontGroupListPayload,
} from '@/features/digital-transform/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { FormSearchKeyword } from '@/shared/components/list/FormSearchKeyword'
import { lineClampTextCell, statusCell, textCell } from '@/shared/components/table/listTableCells'
import { AddButton } from '@/shared/components/ui/AddButton'
import { DataTable } from '@/shared/components/ui/DataTable'
import {
  TABLE_ACTION_CELL_CLASS,
  TABLE_ACTION_COL_META,
  TABLE_ACTION_COL_WIDTH_TWO_ICONS,
} from '@/shared/components/ui/dataTable.constants'
import Pagination from '@/shared/components/ui/Pagination'
import { QueryState } from '@/shared/components/ui/QueryState'
import { usePermission } from '@/shared/hooks/usePermission'
import PageGuard from '@/shared/pages/PageGuard'
import { toastService } from '@/shared/services/toast.service'

import { DEFAULT_CDS_FRONT_GROUP_PAYLOAD } from './constants'
import { groupCode } from './rowAccessors'
import { CDS_RIGHT } from '../../routes/constant'

/** Chuy?n d?i s? > Ngu?i d?ng Front C?S > Nh?m Front C?S */
export default function CdsFrontGroupPage() {
  const { canView, canUpdate } = usePermission(CDS_RIGHT.FRONT_GROUP)
  const { t } = useTranslation()

  const [submittedPayload, setSubmittedPayload] = useState<CdsFrontGroupListPayload>(
    DEFAULT_CDS_FRONT_GROUP_PAYLOAD,
  )
  const [currentPage, setCurrentPage] = useState(DEFAULT_CDS_FRONT_GROUP_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_CDS_FRONT_GROUP_PAYLOAD.RECORD_PER_PAGE)

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cdsFrontGroups', submittedPayload],
    queryFn: () => cdsService.getAllFrontGroups(submittedPayload),
    enabled: canView,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  const handleAdd = useCallback(() => {
    if (!canUpdate) return
    toastService.warning(t('cdsFrontGroup.createNotImplemented'))
  }, [canUpdate, t])

  const handleView = useCallback(
    (row: CdsFrontGroupData) => {
      toastService.warning(t('cdsFrontGroup.viewNotImplemented', { code: groupCode(row) }))
    },
    [t],
  )

  const handleDelete = useCallback(
    (row: CdsFrontGroupData) => {
      if (!canUpdate) return
      if (!window.confirm(t('cdsFrontGroup.confirmDelete', { code: groupCode(row) }))) {
        return
      }
      toastService.warning(t('cdsFrontGroup.deleteNotImplemented'))
    },
    [canUpdate, t],
  )

  const handleReset = useCallback(() => {
    setCurrentPage(1)
    setSubmittedPayload({ ...DEFAULT_CDS_FRONT_GROUP_PAYLOAD })
  }, [])

  const handleSearch = useCallback(
    (keyword: string) => {
      setCurrentPage(1)
      setSubmittedPayload((prev) => ({
        ...prev,
        CODE: keyword,
        NAME: '',
        PAGE: 1,
        RECORD_PER_PAGE: pageSize,
      }))
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

  const columnsDef = useMemo<ColumnDef<CdsFrontGroupData>[]>(
    () => [
      {
        accessorKey: 'C_CREATE_TIME',
        header: t('table.createTime'),
        size: 160,
        cell: textCell,
      },
      {
        accessorKey: 'C_USER_GROUP_CODE',
        header: t('table.groupCode'),
        size: 140,
        cell: textCell,
      },
      {
        accessorKey: 'C_USER_GROUP_NAME',
        header: t('table.groupName'),
        size: 220,
        cell: lineClampTextCell(),
      },
      {
        accessorKey: 'C_NOTE',
        header: t('table.content'),
        size: 240,
        cell: lineClampTextCell(),
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
    [canUpdate, canView, handleDelete, handleView, t],
  )

  const totalRecords =
    rows.length > 0 && rows[0].C_TOTAL_RECORD != null ? Number(rows[0].C_TOTAL_RECORD) : 0

  return (
    <PageGuard functionCode={CDS_RIGHT.FRONT_GROUP}>
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
