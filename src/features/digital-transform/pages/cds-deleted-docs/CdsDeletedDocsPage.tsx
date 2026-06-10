import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { History } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cdsService } from '@/features/digital-transform/services'
import type {
  CdsDeletedDocData,
  CdsDeletedDocListPayload,
} from '@/features/digital-transform/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { FormSearchKeyword } from '@/shared/components/list/FormSearchKeyword'
import {
  fileSizeCell,
  formatApiDate,
  rowTextCell,
  textCell,
} from '@/shared/components/table/listTableCells'
import { createSelectColumn } from '@/shared/components/table/selectColumn'
import { ConfirmActionModal } from '@/shared/components/ui/ConfirmActionModal'
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
import { cn } from '@/shared/utils'

import { DEFAULT_CDS_DELETED_DOC_PAYLOAD } from './constants'
import { deleteTime, department, docNo, fileName, issueDate, rowId, uploader } from './rowAccessors'
import { CDS_RIGHT } from '../../routes/constant'

type RestoreTarget =
  | { mode: 'single'; id: string; name: string }
  | { mode: 'bulk'; ids: string[]; name: string }

const deletedDocsQueryKey = ['cdsDeletedDocs'] as const

/** Chuy?n ??i s? > C?y th? m?c C?S > T?i li?u ?? x?a */
export default function CdsDeletedDocsPage() {
  const { canView, canUpdate } = usePermission(CDS_RIGHT.DELETED_DOC)
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [submittedPayload, setSubmittedPayload] = useState<CdsDeletedDocListPayload>(
    DEFAULT_CDS_DELETED_DOC_PAYLOAD,
  )
  const [currentPage, setCurrentPage] = useState(DEFAULT_CDS_DELETED_DOC_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_CDS_DELETED_DOC_PAYLOAD.RECORD_PER_PAGE)
  const [restoreTarget, setRestoreTarget] = useState<RestoreTarget | null>(null)

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [...deletedDocsQueryKey, submittedPayload],
    queryFn: () => cdsService.getDeletedDocs(submittedPayload),
    enabled: canView,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  const restoreFileMutation = useMutation({
    mutationFn: (listItemId: string) => cdsService.restoreFile({ LIST_ITEM_ID: listItemId }),
  })

  const pageIds = useMemo(() => rows.map(rowId), [rows])
  const selection = useTableRowSelection(pageIds)

  const handleRestoreClick = useCallback(
    (row: CdsDeletedDocData) => {
      if (!canUpdate) return
      setRestoreTarget({
        mode: 'single',
        id: rowId(row),
        name: fileName(row) || rowId(row),
      })
    },
    [canUpdate],
  )

  const handleBulkRestoreClick = useCallback(() => {
    if (!canUpdate) return
    const ids = [...selection.selectedIds]
    if (ids.length === 0) return
    setRestoreTarget({
      mode: 'bulk',
      ids,
      name: t('cdsDeletedDoc.bulkRestoreTarget', { count: ids.length }),
    })
  }, [canUpdate, selection.selectedIds, t])

  const handleConfirmRestore = useCallback(async () => {
    if (!restoreTarget) return
    if (!canUpdate) {
      setRestoreTarget(null)
      return
    }

    const ids = restoreTarget.mode === 'single' ? [restoreTarget.id] : restoreTarget.ids
    let successCount = 0

    try {
      for (const id of ids) {
        const ok = await restoreFileMutation.mutateAsync(id)
        if (ok) successCount += 1
      }

      if (successCount === 0) {
        toastService.error(t('cdsDeletedDoc.toast.restoreFail'))
        return
      }

      await queryClient.invalidateQueries({ queryKey: deletedDocsQueryKey })
      selection.clearSelection()

      if (successCount === ids.length) {
        toastService.success(t('cdsDeletedDoc.toast.restoreSuccess'))
      } else {
        toastService.warning(
          t('cdsDeletedDoc.toast.restorePartial', {
            success: successCount,
            total: ids.length,
          }),
        )
      }

      setRestoreTarget(null)
    } catch {
      toastService.error(t('cdsDeletedDoc.toast.restoreFail'))
    }
  }, [canUpdate, queryClient, restoreFileMutation, restoreTarget, selection, t])

  const handleReset = useCallback(() => {
    setCurrentPage(1)
    selection.clearSelection()
    setSubmittedPayload({ ...DEFAULT_CDS_DELETED_DOC_PAYLOAD })
  }, [selection])

  const handleSearch = useCallback(
    (keyword: string) => {
      setCurrentPage(1)
      selection.clearSelection()
      setSubmittedPayload({ FILTER: keyword, PAGE: 1, RECORD_PER_PAGE: pageSize })
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

  const columnsDef = useMemo<ColumnDef<CdsDeletedDocData>[]>(
    () => [
      createSelectColumn<CdsDeletedDocData>({
        idPrefix: 'cds-deleted-doc',
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
        accessorKey: 'ROW_NUM',
        header: t('table.rowNum'),
        size: 72,
        cell: textCell,
      },
      {
        id: 'fileName',
        header: t('table.fileName'),
        size: 220,
        cell: rowTextCell(fileName, 'line-clamp-2'),
      },
      {
        id: 'docNo',
        header: t('table.docNo'),
        size: 140,
        cell: rowTextCell(docNo),
      },
      {
        id: 'issueDate',
        header: t('table.issueDate'),
        size: 120,
        cell: ({ row }) => {
          const text = formatApiDate(issueDate(row.original))
          if (!text) return null
          return <span>{text}</span>
        },
      },
      {
        accessorKey: 'FILE_SIZE',
        header: t('table.fileSize'),
        size: 100,
        cell: fileSizeCell,
      },
      {
        id: 'uploader',
        header: t('table.uploader'),
        size: 180,
        cell: rowTextCell(uploader, 'line-clamp-2'),
      },
      {
        id: 'deleteTime',
        header: t('table.deleteTime'),
        size: 160,
        cell: ({ row }) => {
          const text = formatApiDate(deleteTime(row.original), 'dd/MM/yyyy HH:mm:ss')
          if (!text) return null
          return <span>{text}</span>
        },
      },
      {
        id: 'department',
        header: t('table.department'),
        size: 260,
        cell: ({ row }) => {
          const text = department(row.original)
          if (!text) return null
          return (
            <span className="line-clamp-2" title={text}>
              {text}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: t('common.action'),
        size: TABLE_ACTION_COL_WIDTH_ONE_ICON,
        meta: TABLE_ACTION_COL_META,
        cell: ({ row }) =>
          canUpdate ? (
            <div className={TABLE_ACTION_CELL_CLASS}>
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                title={t('cdsDeletedDoc.restore')}
                aria-label={t('cdsDeletedDoc.restore')}
                onClick={() => handleRestoreClick(row.original)}
              >
                <History size={16} />
              </button>
            </div>
          ) : null,
      },
    ],
    [canUpdate, handleRestoreClick, selection, t],
  )

  const totalRecords =
    rows.length > 0 && rows[0].C_TOTAL_RECORD != null ? Number(rows[0].C_TOTAL_RECORD) : 0

  const selectedCount = selection.selectedCount
  const showBulkRestoreFooter = canUpdate && selectedCount > 0

  return (
    <PageGuard functionCode={CDS_RIGHT.DELETED_DOC}>
      <div className="m-4">
        <PageToolbar>
          <FormSearchKeyword onSubmit={handleSearch} onReset={handleReset} />
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
          <div className={cn('flex', showBulkRestoreFooter ? 'justify-between' : 'justify-end')}>
            {showBulkRestoreFooter ? (
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <p className="text-sm text-slate-600">
                  {t('common.selectedCount', { count: selectedCount })}
                </p>
                <button
                  type="button"
                  onClick={handleBulkRestoreClick}
                  className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  <History
                    size={14}
                    aria-hidden
                    className="shrink-0 text-blue-100 transition-colors group-hover:text-white"
                  />
                  {t('cdsDeletedDoc.restore')}
                </button>
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

      <ConfirmActionModal
        open={!!restoreTarget}
        actionType="restore"
        objectName={restoreTarget?.name ?? ''}
        onClose={() => setRestoreTarget(null)}
        onConfirm={() => void handleConfirmRestore()}
        cancelText={t('common.cancel')}
        confirmText={t('cdsDeletedDoc.restore')}
      />
    </PageGuard>
  )
}
