import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { systemService } from '@/features/system/services'
import type {
  BackUserGroupListPayload,
  BackUserGroupData,
  BackUserGroupSearchKeys,
} from '@/features/system/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { lineClampTextCell, textCell } from '@/shared/components/table/listTableCells'
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
import { useModalStore } from '@/shared/stores/modal.store'

import { BackUserGroupDetail } from './components/BackUserGroupDetail'
import { FormSearchBackUserGroup } from './components/FormSearchBackUserGroup'
import { DEFAULT_BACK_USER_GROUP_PAYLOAD } from './constants'
import { groupDisplayName } from './rowAccessors'
import { SYSTEM_RIGHT } from '../../routes/constant'

/** H? th?ng > Ngu?i d?ng Back > Nh?m ngu?i d?ng (PERMISSION.GET_ALL_USER_GROUP) */
export default function BackUserGroupPage() {
  const { canView, canUpdate } = usePermission(SYSTEM_RIGHT.GROUP_USER)
  const { t } = useTranslation()
  const { openModal } = useModalStore()

  const [submittedPayload, setSubmittedPayload] = useState<BackUserGroupListPayload>(
    DEFAULT_BACK_USER_GROUP_PAYLOAD,
  )
  const [currentPage, setCurrentPage] = useState(DEFAULT_BACK_USER_GROUP_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_BACK_USER_GROUP_PAYLOAD.RECORD_PER_PAGE)

  const {
    data: rows = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['backUserGroups', submittedPayload],
    queryFn: () => systemService.getAllBackUserGroups(submittedPayload),
    enabled: canView,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })

  const handleAdd = useCallback(() => {
    if (!canUpdate) return
    toastService.warning(t('backUserGroup.createNotImplemented'))
  }, [canUpdate, t])

  const handleViewDetail = useCallback(
    (row: BackUserGroupData) => {
      openModal({
        title: 'modal.backUserGroup.detailTitle',
        size: 'md',
        className: 'text-sm',
        children: <BackUserGroupDetail row={row} />,
      })
    },
    [openModal],
  )

  const handleDelete = useCallback(
    (row: BackUserGroupData) => {
      if (!canUpdate) {
        toastService.warning(t('common.permissionDenied'))
        return
      }
      const name = groupDisplayName(row)
      if (!window.confirm(t('backUserGroup.confirmDelete', { name }))) return
      toastService.warning(t('backUserGroup.deleteNotImplemented'))
    },
    [canUpdate, t],
  )

  const columnsDef = useMemo<ColumnDef<BackUserGroupData>[]>(
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
                  onClick={() => handleViewDetail(r)}
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
    [canUpdate, canView, handleDelete, handleViewDetail, t],
  )

  const handleReset = useCallback(() => {
    setCurrentPage(1)
    setSubmittedPayload({ ...DEFAULT_BACK_USER_GROUP_PAYLOAD })
  }, [])

  const handleSearch = useCallback(
    (values: BackUserGroupSearchKeys) => {
      setCurrentPage(1)
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

  const totalRecords =
    rows.length > 0 && rows[0].C_TOTAL_RECORD != null ? Number(rows[0].C_TOTAL_RECORD) : 0

  return (
    <PageGuard functionCode={SYSTEM_RIGHT.GROUP_USER}>
      <div className="m-4">
        <PageToolbar>
          <FormSearchBackUserGroup onSubmit={handleSearch} onReset={handleReset} />
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
