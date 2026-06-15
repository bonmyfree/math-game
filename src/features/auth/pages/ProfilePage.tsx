import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { authApi } from '@/features/auth/services/auth.api'
import type { BackUserData } from '@/features/auth/types'
import { PageLoader } from '@/shared/components/ui/PageLoader'
import { useAuthStore } from '@/shared/stores/auth.store'

function AccountDetail({ row }: { row: BackUserData }) {
  const { t } = useTranslation()

  const entries: { label: string; value: string }[] = [
    { label: t('backUserAccount.detail.pk'), value: row.PK_USER },
    { label: t('table.loginCode'), value: row.C_BACK_USER_CODE ?? '—' },
    { label: t('table.userName'), value: row.C_USER_NAME ?? '—' },
    { label: t('table.branchOffice'), value: row.C_BRANCH_CODE ?? '—' },
    { label: t('table.room'), value: row.C_SUB_BRANCH_CODE ?? '—' },
    {
      label: t('backUserAccount.detail.status'),
      value:
        row.C_STATUS != null
          ? Number(row.C_STATUS) === 1
            ? t('common.active')
            : t('common.inactive')
          : '—',
    },
    { label: t('backUserAccount.detail.createTime'), value: row.C_CREATE_TIME ?? '—' },
    { label: t('backUserAccount.detail.loginTime'), value: row.C_LOGIN_TIME ?? '—' },
    { label: t('backUserAccount.detail.creator'), value: row.C_CREATOR_CODE ?? '—' },
    { label: t('backUserAccount.detail.userMode'), value: row.C_USER_MODE ?? '—' },
    { label: t('backUserAccount.detail.description'), value: row.C_DESCRIPTION ?? '—' },
    { label: t('backUserAccount.detail.groupRights'), value: row.C_GROUP_RIGHT_LIST ?? '—' },
    { label: t('backUserAccount.detail.password'), value: row.C_PASSWORD ? '••••••••' : '—' },
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

export default function ProfilePage() {
  const { t } = useTranslation()
  const loginCode = useAuthStore((s) => s.user?.role)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['currentUser', loginCode],
    queryFn: async () => {
      if (!loginCode) {
        throw new Error(t('toast.error'))
      }

      const res = await authApi.getCurrentUser(loginCode)

      if (res.iRc !== 1 || !Array.isArray(res.data) || res.data.length === 0) {
        throw new Error(res.sRs ?? t('toast.error'))
      }

      return res.data[0]
    },
    enabled: Boolean(loginCode),
  })

  return (
    <div className="relative top-30 flex justify-center px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Link
          to="/settings"
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          <ChevronLeft size={16} />
          {t('common.back')}
        </Link>
        <div className="mb-6 flex items-center gap-3">
          <User size={22} className="text-blue-500" />
          <h1 className="text-xl font-bold text-slate-800">{t('auth.accountInfo')}</h1>
        </div>

        {isLoading ? <PageLoader /> : null}
        {isError ? <p className="text-sm text-destructive">{t('toast.error')}</p> : null}
        {data ? <AccountDetail row={data} /> : null}
      </div>
    </div>
  )
}
