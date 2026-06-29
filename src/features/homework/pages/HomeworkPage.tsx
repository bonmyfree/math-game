import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TemplatePage } from '@/shared/pages/TemplatePage'

export default function HomeworkPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      {/* Nút quay lại trang Tài liệu (Bài tập là mục con của Tài liệu). */}
      <button
        type="button"
        onClick={() => navigate({ to: '/documents' })}
        className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
      >
        <ChevronLeft size={18} />
        {t('nav.documents')}
      </button>
      <TemplatePage title={t('nav.homework')} />
    </div>
  )
}
