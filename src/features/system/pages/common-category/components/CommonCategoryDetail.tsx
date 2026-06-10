import { useTranslation } from 'react-i18next'

import type { CommonCategoryData } from '@/features/system/services'

import { COMMON_CATEGORY_GROUP } from '../constants'

type Props = {
  row: CommonCategoryData
}

export function CommonCategoryDetail({ row }: Props) {
  const { t } = useTranslation()
  const statusLabel = Number(row.C_STATUS) === 1 ? t('common.active') : t('common.inactive')
  const group = String(row.C_GROUP ?? '').toUpperCase()
  const groupLabel =
    group === COMMON_CATEGORY_GROUP.USER
      ? t('commonCategory.search.groupUser')
      : group === COMMON_CATEGORY_GROUP.SYSTEM
        ? t('commonCategory.search.groupSystem')
        : (row.C_GROUP ?? '—')

  const rows: { label: string; value: string }[] = [
    { label: t('table.categoryCode'), value: row.C_CODE },
    { label: t('table.categoryName'), value: row.C_NAME },
    { label: t('table.group'), value: groupLabel },
    { label: t('table.order'), value: String(row.C_ORDER ?? '—') },
    { label: t('common.status'), value: statusLabel },
    { label: t('common.note'), value: row.C_NOTE ?? '—' },
  ]

  return (
    <div className="space-y-1 px-1 py-2 text-sm text-slate-700">
      <dl className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
        {rows.map(({ label, value }) => (
          <div key={label} className="grid grid-cols-1 gap-1 px-3 py-2.5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-1">
              {label}
            </dt>
            <dd className="text-slate-900 sm:col-span-2">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
