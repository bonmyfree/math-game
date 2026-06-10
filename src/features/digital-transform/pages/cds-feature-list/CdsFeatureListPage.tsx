import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cdsService } from '@/features/digital-transform/services'
import type { CdsFeatureData, CdsFeatureListPayload } from '@/features/digital-transform/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { FormSearchKeyword } from '@/shared/components/list/FormSearchKeyword'
import {
  dateCell,
  rowTextCell,
  statusCell,
  textCell,
} from '@/shared/components/table/listTableCells'
import { createSelectColumn } from '@/shared/components/table/selectColumn'
import { AddButton } from '@/shared/components/ui/AddButton'
import { DataTable } from '@/shared/components/ui/DataTable'
import {
  TABLE_ACTION_CELL_CLASS,
  TABLE_ACTION_COL_META,
  TABLE_ACTION_COL_WIDTH_ONE_ICON,
} from '@/shared/components/ui/dataTable.constants'
import Pagination from '@/shared/components/ui/Pagination'
import { QueryState } from '@/shared/components/ui/QueryState'
import { usePermission } from '@/shared/hooks/usePermission'
import { useTableRowSelection } from '@/shared/hooks/useTableRowSelection'
import PageGuard from '@/shared/pages/PageGuard'
import { toastService } from '@/shared/services/toast.service'

import { DEFAULT_CDS_FEATURE_PAYLOAD } from './constants'
import {
  featureName,
  phaseLabel,
  pmLabel,
  priorityLabel,
  projectLabel,
  rowId,
} from './rowAccessors'
import { CDS_RIGHT } from '../../routes/constant'

/** Chuy?n ??i s? > Qu?n l? d? ?n C?S > Danh s?ch t?nh n?ng */
export default function CdsFeatureListPage() {
  const { canView, canUpdate } = usePermission(CDS_RIGHT.FEATURE_LIST)
  const { t } = useTranslation()

  const [submittedPayload, setSubmittedPayload] = useState<CdsFeatureListPayload>(
    DEFAULT_CDS_FEATURE_PAYLOAD,
  )
  const [currentPage, setCurrentPage] = useState(DEFAULT_CDS_FEATURE_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_CDS_FEATURE_PAYLOAD.RECORD_PER_PAGE)

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cdsFeatures', submittedPayload],
    queryFn: () => cdsService.getAllFeatures(submittedPayload),
    enabled: canView,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  const pageIds = useMemo(() => rows.map(rowId), [rows])
  const selection = useTableRowSelection(pageIds)

  const handleAdd = useCallback(() => {
    if (!canUpdate) return
    toastService.warning(t('cdsFeature.createNotImplemented'))
  }, [canUpdate, t])

  const handleView = useCallback(
    (row: CdsFeatureData) => {
      toastService.warning(t('cdsFeature.viewNotImplemented', { name: featureName(row) }))
    },
    [t],
  )

  const handleReset = useCallback(() => {
    setCurrentPage(1)
    selection.clearSelection()
    setSubmittedPayload({ ...DEFAULT_CDS_FEATURE_PAYLOAD })
  }, [selection])

  const handleSearch = useCallback(
    (keyword: string) => {
      setCurrentPage(1)
      selection.clearSelection()
      setSubmittedPayload({ CODE: keyword, NAME: '', PAGE: 1, RECORD_PER_PAGE: pageSize })
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

  const columnsDef = useMemo<ColumnDef<CdsFeatureData>[]>(
    () => [
      createSelectColumn<CdsFeatureData>({
        idPrefix: 'cds-feature',
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
      { accessorKey: 'ROW_NUM', header: t('table.rowNum'), size: 72, cell: textCell },
      {
        id: 'featureName',
        header: t('table.featureName'),
        size: 200,
        cell: rowTextCell(featureName, 'line-clamp-2'),
      },
      {
        id: 'project',
        header: t('table.project'),
        size: 160,
        cell: rowTextCell(projectLabel),
      },
      {
        id: 'phase',
        header: t('table.phase'),
        size: 160,
        cell: rowTextCell(phaseLabel),
      },
      {
        id: 'pm',
        header: t('table.pm'),
        size: 140,
        cell: rowTextCell(pmLabel),
      },
      {
        id: 'priority',
        header: t('table.priority'),
        size: 120,
        cell: rowTextCell(priorityLabel),
      },
      {
        accessorKey: 'C_START_DATE',
        header: t('table.startDate'),
        size: 120,
        cell: dateCell<CdsFeatureData>(),
      },
      {
        accessorKey: 'C_END_DATE',
        header: t('table.endDate'),
        size: 120,
        cell: dateCell<CdsFeatureData>(),
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
        size: TABLE_ACTION_COL_WIDTH_ONE_ICON,
        meta: TABLE_ACTION_COL_META,
        cell: ({ row }) =>
          canView ? (
            <div className={TABLE_ACTION_CELL_CLASS}>
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                title={t('common.viewDetail')}
                onClick={() => handleView(row.original)}
              >
                <Eye size={16} />
              </button>
            </div>
          ) : null,
      },
    ],
    [canView, handleView, selection, t],
  )

  const totalRecords =
    rows.length > 0 && rows[0].C_TOTAL_RECORD != null ? Number(rows[0].C_TOTAL_RECORD) : 0

  return (
    <PageGuard functionCode={CDS_RIGHT.FEATURE_LIST}>
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
