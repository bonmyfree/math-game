import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { systemService } from '@/features/system/services'
import {
  SystemLogData,
  SystemLogDetailData,
  SystemLogPayload,
  SystemLogSearchKeys,
} from '@/features/system/services'
import { DataTable } from '@/shared/components/ui/DataTable'
import {
  TABLE_ACTION_CELL_CLASS,
  TABLE_ACTION_COL_META,
  TABLE_ACTION_COL_WIDTH_ONE_ICON,
} from '@/shared/components/ui/dataTable.constants'
import Pagination from '@/shared/components/ui/Pagination'
import { QueryState } from '@/shared/components/ui/QueryState'
import { usePermission } from '@/shared/hooks/usePermission'
import PageGuard from '@/shared/pages/PageGuard'
import { useModalStore } from '@/shared/stores/modal.store'

import { FormSearchLogs } from './components/FormSearchLogs'
import { LogDetail } from './components/LogDetail'
import { DEFAULT_PAYLOAD } from './constants'
import { rowId } from './rowAccessors'
import { SYSTEM_RIGHT } from '../../routes/constant'

// Hệ thống > Vận hành hệ thống > Tra cứu log hệ thống
export default function SystemLogPage() {
  const { canView } = usePermission(SYSTEM_RIGHT.SYSTEM_LOG)
  const { t } = useTranslation()

  const [submittedFilter, setSubmittedFilter] = useState<SystemLogPayload>(DEFAULT_PAYLOAD)
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAYLOAD.PAGE)
  const [pageSize, setPageSize] = useState(DEFAULT_PAYLOAD.RECORD_PER_PAGE)

  const {
    data: systemEodLogs = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['systemLogs', submittedFilter],
    queryFn: () => systemService.getSystemLogs(submittedFilter),
    enabled: canView, // Chỉ query khi có quyền view
    placeholderData: keepPreviousData, // giữ data cũ khi đang fetch trang mới → isLoading không bật lại → DataTable không bị unmount → pagination state giữ nguyên
    staleTime: 0,
  })

  const { openModal } = useModalStore()

  const handleViewDetail = useCallback(
    async (log: SystemLogData) => {
      console.log('View detail:', log)
      // TODO: View Detail
      const data: SystemLogDetailData[] = await systemService.getSystemLogDetail(rowId(log))
      if (data) {
        openModal({
          title: 'modal.detail.log',
          children: <LogDetail data={data[0]} />,
          className: 'text-sm',
          size: 'full',
          // footer: <ConfirmButtons />,
        })

        console.log(data)
      }
    },
    [openModal],
  )

  // const systemEodLogs = useSystemStore((state) => state.systemEodLogs)
  // const columnHelper = createColumnHelper<SystemLogData>()
  const columnsDef = useMemo<ColumnDef<SystemLogData>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        size: 50,
        cell: ({ row }) => (currentPage - 1) * pageSize + row.index + 1,
      },
      {
        accessorKey: 'C_TRADING_DATE', // ← đổi theo đúng field trong SystemLogData
        header: t('common.transactionDate'),
        size: 100,
        cell: ({ getValue }) => {
          const value = getValue<string>()
          return <span>{value}</span>
        },
      },
      {
        accessorKey: 'C_ACTION_TYPE',
        header: t('common.actionType'),
        size: 90,
        cell: ({ getValue }) => {
          const value = getValue<string>()
          return <span>{value}</span>
        },
      },
      {
        accessorKey: 'C_DATA_CODE',
        header: t('common.data'),
        size: 200,
        cell: ({ getValue }) => {
          const value = getValue<string>()
          return <span>{value}</span>
        },
      },
      {
        accessorKey: 'C_BUSINESS_CODE',
        header: t('common.business'),
        size: 120,
        cell: ({ getValue }) => {
          const value = getValue<string>()
          return <span>{value}</span>
        },
      },
      {
        accessorKey: 'C_CONTENT',
        header: t('common.note'),
        size: 200,
        cell: ({ getValue }) => <span className="line-clamp-2">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'C_STATUS',
        header: t('common.status'),
        size: 100,
        cell: ({ getValue }) => {
          const status = getValue<string>()
          return <span>{status}</span>
        },
      },
      {
        accessorKey: 'C_CREATOR_CODE',
        header: t('common.creator'),
        size: 150,
      },
      {
        accessorKey: 'C_CREATE_TIME',
        header: t('common.time'),
        size: 100,
      },
      {
        id: 'actions',
        header: t('common.action'),
        size: TABLE_ACTION_COL_WIDTH_ONE_ICON,
        meta: TABLE_ACTION_COL_META,
        cell: ({ row }) => (
          <div className={TABLE_ACTION_CELL_CLASS}>
            <button
              className="flex items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 cursor-pointer"
              title={t('common.viewDetail')}
              onClick={() => handleViewDetail(row.original)}
            >
              <Eye size={16} />
            </button>
          </div>
        ),
      },
    ],
    [currentPage, pageSize, t, handleViewDetail],
  )

  const handleReset = () => {
    setCurrentPage(1)
    setSubmittedFilter({ ...DEFAULT_PAYLOAD }) // reset filter
  }
  const handleSearch = (values: SystemLogSearchKeys) => {
    setCurrentPage(1)
    setSubmittedFilter({ ...values, PAGE: 1, RECORD_PER_PAGE: pageSize })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSubmittedFilter((prev) => ({ ...prev, PAGE: page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize)
    setCurrentPage(1)
    setSubmittedFilter((prev) => ({ ...prev, PAGE: 1, RECORD_PER_PAGE: pageSize }))
  }
  return (
    <PageGuard functionCode={SYSTEM_RIGHT.SYSTEM_LOG}>
      {/* Filter */}
      <div className="m-4">
        <FormSearchLogs onSubmit={handleSearch} onReset={handleReset} />
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      >
        <>
          <DataTable
            data={systemEodLogs}
            columns={columnsDef}
            isLoading={isFetching}
            pageSize={pageSize}
          />
          <Pagination
            page={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            recordPerPage={pageSize}
            total={
              (systemEodLogs && !!systemEodLogs.length && systemEodLogs[0].C_TOTAL_RECORD) || 0
            }
          />
        </>
      </QueryState>
    </PageGuard>
  )
}
