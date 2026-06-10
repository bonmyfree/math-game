import { useQuery } from '@tanstack/react-query'
import { User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { authApi } from '@/features/auth/services/auth.api'
import { BackUserAccountDetail } from '@/features/system/pages/back-user-accounts/components/BackUserAccountDetail'
import { PageLoader } from '@/shared/components/ui/PageLoader'
import { useAuthStore } from '@/shared/stores/auth.store'

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
        <div className="mb-6 flex items-center gap-3">
          <User size={22} className="text-blue-500" />
          <h1 className="text-xl font-bold text-slate-800">{t('auth.accountInfo')}</h1>
        </div>

        {isLoading ? <PageLoader /> : null}
        {isError ? <p className="text-sm text-destructive">{t('toast.error')}</p> : null}
        {data ? <BackUserAccountDetail row={data} /> : null}
      </div>
    </div>
  )
}
