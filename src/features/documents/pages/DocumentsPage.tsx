import { useNavigate } from '@tanstack/react-router'
import { BookOpen, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { LucideIcon } from 'lucide-react'

type DocItem = {
  id: string
  /** Tên mục */
  name: string
  /** Mô tả ngắn */
  desc: string
  icon: LucideIcon
  /** Gradient nền huy hiệu icon */
  gradient: string
  /** Đường dẫn tới mục */
  to: string
}

// Các mục bên trong trang Tài liệu.
const DOC_ITEMS: DocItem[] = [
  {
    id: 'homework',
    name: 'Bài tập',
    desc: 'Luyện tập các bài toán theo chủ đề',
    icon: BookOpen,
    gradient: 'from-sky-400 to-blue-500',
    to: '/homework',
  },
]

export default function DocumentsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="relative -m-6 min-h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-b from-blue-50 via-sky-50 to-white p-6 md:min-h-dvh">
      {/* Trang trí nền mờ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -left-10 -top-12 h-44 w-44 rounded-full bg-sky-200/40" />
        <span className="absolute -right-8 top-24 h-32 w-32 rounded-full bg-blue-200/40" />
      </div>

      <div className="relative">
        {/* Tiêu đề */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{t('nav.documents')}</h1>
          <p className="text-sm text-slate-500">Chọn một mục để xem nội dung</p>
        </div>

        {/* Danh sách mục */}
        <div className="flex flex-col gap-3">
          {DOC_ITEMS.map(({ id, name, desc, icon: Icon, gradient, to }, i) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate({ to })}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-game-pop-in flex items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md`}
              >
                <Icon size={26} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-slate-800">{name}</span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-500">{desc}</span>
              </span>
              <ChevronRight className="shrink-0 text-slate-300" size={22} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
