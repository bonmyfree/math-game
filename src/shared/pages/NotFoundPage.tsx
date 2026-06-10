import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
      <p className="text-lg font-semibold">404 - {t('common.pageNotFound')}</p>
      <Link to="/dashboard" className="text-sm text-blue-500 hover:underline">
        {t('common.backHome')}
      </Link>
    </div>
  )
}
