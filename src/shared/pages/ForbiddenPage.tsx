import { Link } from '@tanstack/react-router'
import { ShieldOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ForbiddenPage() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
      <ShieldOff size={48} className="text-slate-300" />
      <h1 className="text-xl font-semibold text-slate-700">{t(`common.permissionDeniedTitle`)}</h1>
      <p className="text-sm text-slate-400">{t(`common.permissionDenied`)}</p>
      <Link
        to="/"
        className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
      >
        {t(`common.backHome`)}
      </Link>
    </div>
  )
}
