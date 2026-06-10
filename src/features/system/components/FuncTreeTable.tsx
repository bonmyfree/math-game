import {
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePermission } from '@/shared/hooks/usePermission'
import type { AuthorityTreeRow } from '@/shared/types'
import { cn } from '@/shared/utils'

export interface FuncTreeTableProps {
  /** Danh sách phẳng từ API (C_LEVEL + C_PARENT_CODE) */
  rows: AuthorityTreeRow[]
  /** Mã chức năng (vd. SYSTEM_RIGHT.BACK_FUNCTION) — dùng với usePermission cho cột thao tác */
  functionCode: string
  showActions?: boolean
  onDetail?: (pk: string | number) => void
  onDelete?: (pk: string | number) => void
  className?: string
}

type GroupedByLevel = Record<number, AuthorityTreeRow[]>

function groupByLevel(rows: AuthorityTreeRow[]): GroupedByLevel {
  return rows.reduce<GroupedByLevel>((acc, item) => {
    const lv = item.C_LEVEL
    acc[lv] = acc[lv] ?? []
    acc[lv].push(item)
    return acc
  }, {})
}

function isFlagOn(v: unknown): v is 1 {
  return v === 1
}

/** Đủ rộng cho nhãn header tiếng Việt (vd. Hoạt động, Cập nhật) một dòng */
const FLAG_COL_CLASS = 'w-[5.75rem] shrink-0'

function FlagCell({ value }: { value: unknown }) {
  return (
    <div className={cn(FLAG_COL_CLASS, 'flex justify-center')}>
      {isFlagOn(value) && (
        <Check size={14} strokeWidth={2.5} className="text-emerald-600" aria-hidden />
      )}
    </div>
  )
}

function RowActions({
  pk,
  allowView,
  allowUpdate,
  onDetail,
  onDelete,
}: {
  pk: string | number
  allowView: boolean
  allowUpdate: boolean
  onDetail?: (pk: string | number) => void
  onDelete?: (pk: string | number) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="w-22 shrink-0 flex justify-center gap-0.5">
      {allowView && onDetail && (
        <button
          type="button"
          title={t('common.detail')}
          onClick={(e) => {
            e.stopPropagation()
            onDetail(pk)
          }}
          className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 transition-colors cursor-pointer"
        >
          <Eye size={16} strokeWidth={2} aria-hidden />
        </button>
      )}
      {allowUpdate && onDelete && (
        <button
          type="button"
          title={t('common.delete')}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(pk)
          }}
          className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 transition-colors cursor-pointer"
        >
          <Trash2 size={16} strokeWidth={2} aria-hidden />
        </button>
      )}
    </div>
  )
}

interface TreeNodeProps {
  item: AuthorityTreeRow
  grouped: GroupedByLevel
  level: number
  showActions: boolean
  allowActionView: boolean
  allowActionUpdate: boolean
  onDetail?: (pk: string | number) => void
  onDelete?: (pk: string | number) => void
}

function TreeNode({
  item,
  grouped,
  level,
  showActions,
  allowActionView,
  allowActionUpdate,
  onDetail,
  onDelete,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 1)
  const nextLevel = level + 1
  const children = (grouped[nextLevel] ?? [])
    .filter((o) => o.C_PARENT_CODE === item.C_CODE)
    .sort((a, b) => (a.ROW_NUM ?? a.C_ORDER ?? 0) - (b.ROW_NUM ?? b.C_ORDER ?? 0))

  const hasChildren = children.length > 0

  return (
    <li className={cn('list-none', !hasChildren && 'border-b border-dotted border-slate-200')}>
      <div
        className={cn(
          'flex items-center gap-1 py-2 relative select-none text-slate-800',
          hasChildren && 'cursor-pointer',
          level > 1 && 'text-sm',
        )}
        onClick={() => hasChildren && setIsOpen((o) => !o)}
      >
        <span
          className={cn(
            'flex-1 flex items-center gap-1.5 min-w-0 pl-0.5',
            hasChildren ? 'font-semibold' : 'font-normal text-slate-600',
          )}
        >
          {hasChildren ? (
            <>
              {isOpen ? (
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-slate-500"
                  aria-hidden
                />
              ) : (
                <ChevronRight
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-slate-500"
                  aria-hidden
                />
              )}
              {isOpen ? (
                <FolderOpen
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-amber-600"
                  aria-hidden
                />
              ) : (
                <Folder size={16} strokeWidth={2} className="shrink-0 text-amber-600" aria-hidden />
              )}
            </>
          ) : (
            <>
              <span className="inline-flex w-4 shrink-0 justify-center" aria-hidden />
              <FileText size={16} strokeWidth={2} className="shrink-0 text-slate-400" aria-hidden />
            </>
          )}
          <span className="truncate">{item.C_MENU_NAME}</span>
        </span>

        <div className="w-24 shrink-0 text-center text-xs font-medium text-slate-700 tabular-nums">
          {item.C_CODE}
        </div>
        <FlagCell value={item.C_ADMIN_FLAG} />
        <FlagCell value={item.C_ACTIVE} />
        <FlagCell value={item.C_APPROVE_FLAG} />
        <FlagCell value={item.C_UPDATE_FLAG} />
        <FlagCell value={item.C_VIEW_FLAG} />
        {showActions && (
          <RowActions
            pk={item.PK_AUTHORITY}
            allowView={allowActionView}
            allowUpdate={allowActionUpdate}
            onDetail={onDetail}
            onDelete={onDelete}
          />
        )}

        {hasChildren && (
          <span className="absolute bottom-0 right-0 w-[calc(100%-1.5rem)] border-b border-dotted border-slate-300" />
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className="ml-1.5 pl-4 border-l border-dashed border-slate-300 mt-0.5">
          {children.map((child, i) => (
            <TreeNode
              key={`${String(child.PK_AUTHORITY)}-${i}`}
              item={child}
              grouped={grouped}
              level={nextLevel}
              showActions={showActions}
              allowActionView={allowActionView}
              allowActionUpdate={allowActionUpdate}
              onDetail={onDetail}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function FuncTreeTable({
  rows,
  functionCode,
  showActions = true,
  onDetail,
  onDelete,
  className,
}: FuncTreeTableProps) {
  const { t } = useTranslation()
  const { canView: allowActionView, canUpdate: allowActionUpdate } = usePermission(functionCode)
  const showActionColumn = showActions && (allowActionView || allowActionUpdate)
  const grouped = useMemo(() => groupByLevel(rows), [rows])

  const rootItems = useMemo(() => {
    const lv1 = grouped[1] ?? []
    return lv1
      .filter((r) => r.C_PARENT_CODE === null || r.C_PARENT_CODE === undefined)
      .sort((a, b) => (a.ROW_NUM ?? a.C_ORDER ?? 0) - (b.ROW_NUM ?? b.C_ORDER ?? 0))
  }, [grouped])

  const headerMeta = useMemo(
    () => [
      { label: t('common.code'), className: 'w-24' },
      { label: t('common.admin'), className: FLAG_COL_CLASS },
      { label: t('common.active'), className: FLAG_COL_CLASS },
      { label: t('common.approve'), className: FLAG_COL_CLASS },
      { label: t('common.update'), className: FLAG_COL_CLASS },
      { label: t('common.view'), className: FLAG_COL_CLASS },
      ...(showActionColumn
        ? ([{ label: t('common.actions'), className: 'w-[5.5rem]' }] as const)
        : []),
    ],
    [t, showActionColumn],
  )

  if (rows.length === 0 || rootItems.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500',
          className,
        )}
      >
        {t('common.emptyData')}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/90 px-2 py-2.5 text-[13px] font-semibold text-slate-600">
        <div className="flex-1 min-w-0" />
        {headerMeta.map(({ label, className: col }, i) => (
          <div
            key={label}
            className={cn(
              'shrink-0 flex flex-col items-center justify-center text-center leading-tight px-1 border-l border-slate-200 whitespace-nowrap',
              i === 0 && 'border-l-0 sm:border-l',
              col,
            )}
          >
            {label}
          </div>
        ))}
      </div>

      <ul className="px-2 py-2">
        {rootItems.map((item, index) => (
          <TreeNode
            key={`${String(item.PK_AUTHORITY)}-${index}`}
            item={item}
            grouped={grouped}
            level={1}
            showActions={showActionColumn}
            allowActionView={allowActionView}
            allowActionUpdate={allowActionUpdate}
            onDetail={onDetail}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}
