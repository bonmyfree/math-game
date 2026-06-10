import { useTranslation } from 'react-i18next'

import type { BackUserGroupData } from '@/features/system/services'

type Props = {
  row: BackUserGroupData
}

export function BackUserGroupDetail({ row }: Props) {
  const { t } = useTranslation()
  const statusLabel = Number(row.C_STATUS) === 1 ? t('common.active') : t('common.inactive')

  const rows: { label: string; value: string }[] = [
    { label: t('table.createTime'), value: row.C_CREATE_TIME ?? '—' },
    { label: t('table.groupCode'), value: row.C_USER_GROUP_CODE },
    { label: t('table.groupName'), value: row.C_USER_GROUP_NAME },
    { label: t('table.content'), value: row.C_NOTE ?? '—' },
    { label: t('common.status'), value: statusLabel },
    { label: t('common.creator'), value: row.C_CREATOR_CODE ?? '—' },
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
