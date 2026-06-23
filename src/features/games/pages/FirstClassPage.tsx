import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Hash, Plus, Minus, Scale, Shapes, Brain } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { LucideIcon } from 'lucide-react'

type Game = {
  id: string
  /** Tên trò chơi */
  name: string
  icon: LucideIcon
  /** Gradient nền của ô game */
  gradient: string
  /** Màu chấm sáng trang trí (mờ) phía sau */
  glow: string
  /** Đường dẫn tới game (nếu đã làm xong). */
  to?: string
}

const GAMES: Game[] = [
  {
    id: 'counting',
    name: 'Đếm số',
    icon: Hash,
    gradient: 'from-rose-400 to-pink-500',
    glow: 'bg-rose-300',
    to: '/games/1/counting',
  },
  {
    id: 'addition',
    name: 'Phép cộng',
    icon: Plus,
    gradient: 'from-amber-400 to-orange-500',
    glow: 'bg-amber-300',
    to: '/games/1/addition',
  },
  {
    id: 'subtraction',
    name: 'Phép trừ',
    icon: Minus,
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'bg-emerald-300',
    to: '/games/1/subtraction',
  },
  {
    id: 'compare',
    name: 'So sánh số',
    icon: Scale,
    gradient: 'from-sky-400 to-blue-500',
    glow: 'bg-sky-300',
    to: '/games/1/compare',
  },
  {
    id: 'shapes',
    name: 'Hình khối',
    icon: Shapes,
    gradient: 'from-violet-400 to-purple-500',
    glow: 'bg-violet-300',
    to: '/games/1/shapes',
  },
  {
    id: 'quiz',
    name: 'Đố vui toán',
    icon: Brain,
    gradient: 'from-fuchsia-400 to-pink-500',
    glow: 'bg-fuchsia-300',
    to: '/games/1/quiz',
  },
]

export default function FirstClassPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="relative -m-6 min-h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-b from-indigo-50 via-sky-50 to-white p-6 md:min-h-dvh">
      {/* Background chủ đề toán học: các hình khối hình học mờ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -left-10 -top-12 h-44 w-44 rounded-full border-[12px] border-indigo-200/50" />
        <span className="absolute -right-8 top-24 h-32 w-32 rotate-12 rounded-3xl bg-sky-200/40" />
        <span className="absolute bottom-40 left-8 h-0 w-0 -rotate-12 border-x-[30px] border-b-[52px] border-x-transparent border-b-violet-200/50" />
        <span className="absolute bottom-16 -right-6 h-28 w-28 rounded-full bg-amber-200/40" />
        <span className="absolute bottom-24 left-1/2 h-16 w-16 rounded-full border-[8px] border-rose-200/50" />
        <span className="absolute right-12 top-10 h-3 w-3 rounded-full bg-indigo-300/60" />
      </div>

      {/* Nội dung */}
      <div className="relative">
        {/* Tiêu đề + nút quay lại */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: '/home' })}
            aria-label={t('common.back')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t('home.gradeLabel')} 1</h1>
            <p className="text-sm text-slate-500">{t('games.subtitle')}</p>
          </div>
        </div>

        {/* Lưới game 3 cột, ô vuông */}
        <div className="grid grid-cols-3 gap-3">
          {GAMES.map(({ id, name, icon: Icon, gradient, glow, to }) => (
            <button
              key={id}
              type="button"
              onClick={() => to && navigate({ to })}
              className={`group relative flex aspect-square flex-col items-center justify-center gap-2.5 overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg shadow-slate-200/60 transition-all duration-300 active:scale-[0.96] hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50`}
            >
              {/* Quầng sáng mờ */}
              <span
                className={`pointer-events-none absolute -right-5 -top-6 h-20 w-20 rounded-full ${glow} opacity-40 blur-2xl`}
              />
              {/* Icon lớn mờ làm hình nền */}
              <Icon
                className="pointer-events-none absolute -bottom-3 -right-2 text-white/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                size={72}
                strokeWidth={1.5}
              />

              {/* Icon trong huy hiệu kính mờ */}
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110">
                <Icon size={24} strokeWidth={2.2} />
              </span>

              {/* Tên game */}
              <span className="relative text-center text-[13px] font-bold leading-tight">
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
