import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function PageLoader() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 size={32} className="animate-spin text-blue-500" />
        <span className="text-sm">{t('common.loading')}</span>
      </div>
    </div>
  )
}
