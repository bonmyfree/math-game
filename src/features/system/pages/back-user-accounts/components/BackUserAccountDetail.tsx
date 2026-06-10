import { useTranslation } from 'react-i18next'

import type { BackUserData } from '@/features/system/services'

function maskPassword() {
  return '••••••••'
}

export function BackUserAccountDetail({ row }: { row: BackUserData }) {
  const { t } = useTranslation()

  const entries: { label: string; value: string }[] = [
    { label: t('backUserAccount.detail.pk'), value: row.PK_USER },
    {
      label: t('table.loginCode'),
      value: row.C_BACK_USER_CODE ?? '—',
    },
    {
      label: t('table.userName'),
      value: row.C_USER_NAME ?? '—',
    },
    {
      label: t('table.branchOffice'),
      value: row.C_BRANCH_CODE ?? '—',
    },
    {
      label: t('table.room'),
      value: row.C_SUB_BRANCH_CODE ?? '—',
    },
    {
      label: t('backUserAccount.detail.status'),
      value:
        row.C_STATUS != null
          ? Number(row.C_STATUS) === 1
            ? t('common.active')
            : t('common.inactive')
          : '—',
    },
    {
      label: t('backUserAccount.detail.createTime'),
      value: row.C_CREATE_TIME ?? '—',
    },
    {
      label: t('backUserAccount.detail.loginTime'),
      value: row.C_LOGIN_TIME ?? '—',
    },
    {
      label: t('backUserAccount.detail.creator'),
      value: row.C_CREATOR_CODE ?? '—',
    },
    {
      label: t('backUserAccount.detail.userMode'),
      value: row.C_USER_MODE ?? '—',
    },
    {
      label: t('backUserAccount.detail.description'),
      value: row.C_DESCRIPTION ?? '—',
    },
    {
      label: t('backUserAccount.detail.groupRights'),
      value: row.C_GROUP_RIGHT_LIST ?? '—',
    },
    {
      label: t('backUserAccount.detail.password'),
      value: row.C_PASSWORD ? maskPassword() : '—',
    },
  ]

  return (
    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      {entries.map(({ label, value }) => (
        <div key={label} className="min-w-0 sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
          <dd className="mt-0.5 break-words text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
