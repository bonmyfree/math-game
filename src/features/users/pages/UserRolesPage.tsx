import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function UserRolesPage() {
  const { t } = useTranslation()
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck size={22} className="text-violet-500" />
        <h1 className="text-xl font-bold text-slate-800">{t('nav.userRoles')}</h1>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex items-center justify-center h-48 text-slate-400 text-sm border-dashed">
        Role management content goes here
      </div>
    </div>
  )
}
