import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/utils'

type PagingProps = {
  className?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  page: number
  recordPerPage: number
  total?: number
  isElement?: boolean
}

const Pagination: React.FC<PagingProps> = ({
  className,
  onPageChange,
  page,
  recordPerPage,
  onPageSizeChange,
  total = 0,
  isElement,
}) => {
  const { t } = useTranslation()

  const currentPage = page < 1 ? 1 : page
  const pagesCount = Math.ceil(total / recordPerPage)

  const isFirst = currentPage === 1
  const isLast = currentPage === pagesCount

  const changePage = (p: number) => {
    if (p === currentPage) return
    onPageChange(p)
  }

  useEffect(() => {
    if (pagesCount > 0 && currentPage > pagesCount) {
      onPageChange(pagesCount)
    }
  }, [currentPage, onPageChange, pagesCount])

  const pageNumbers = Array.from({ length: pagesCount }, (_, i) => i + 1).reduce<React.ReactNode[]>(
    (acc, pageNum) => {
      const isFirstPage = pageNum === 1
      const isLastPage = pageNum === pagesCount
      const isNearCurrent = Math.abs(pageNum - currentPage) <= 1

      if (isFirstPage || isLastPage || isNearCurrent) {
        acc.push(
          <button
            key={pageNum}
            onClick={() => changePage(pageNum)}
            className={`px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm cursor-pointer
            ${
              pageNum === currentPage
                ? 'text-yellow-500'
                : 'text-gray-500 hover:bg-yellow-400 hover:text-white'
            }`}
          >
            {pageNum}
          </button>,
        )
      } else {
        // Chỉ thêm ellipsis nếu phần tử cuối chưa phải ellipsis
        const lastItem = acc[acc.length - 1]
        const isLastItemEllipsis =
          React.isValidElement(lastItem) && lastItem.type === MoreHorizontal

        if (!isLastItemEllipsis) {
          acc.push(
            <MoreHorizontal key={`ellipsis-${pageNum}`} className="ml-2 text-gray-400 w-4 h-4" />,
          )
        }
      }

      return acc
    },
    [],
  )

  return (
    <div className={cn('m-3 d-flex justify-content-end text-sm', className)}>
      <div className="flex items-center w-full justify-end">
        {!isElement && (
          <select
            className="w-42.5 h-9 rounded-lg border border-slate-200 bg-white px-3 py-0 text-sm leading-5 transition-all cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            value={recordPerPage}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value))
            }}
          >
            <option value={10}>10 {t('table.pageSize')}</option>
            <option value={20}>20 {t('table.pageSize')}</option>
            <option value={50}>50 {t('table.pageSize')}</option>
            <option value={100}>100 {t('table.pageSize')}</option>
          </select>
        )}

        {pagesCount > 0 && (
          <div className="flex items-center ml-2">
            {/* Về trang đầu */}
            <button
              onClick={() => changePage(1)}
              className="ml-2 px-2 h-8 rounded-lg bg-white text-gray-500 hover:bg-yellow-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Trang trước */}
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={isFirst}
              className="ml-2 px-2 h-8 rounded-lg bg-white text-gray-500 disabled:bg-gray-200 hover:bg-yellow-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers}

            {/* Trang sau */}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={isLast}
              className="ml-2 px-2 h-8 rounded-lg bg-white text-gray-500 disabled:bg-gray-200 hover:bg-yellow-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Về trang cuối */}
            <button
              onClick={() => changePage(pagesCount)}
              className="ml-2 px-2 h-8 rounded-lg bg-white text-gray-500 hover:bg-yellow-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pagination
