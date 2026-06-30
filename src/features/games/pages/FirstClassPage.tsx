import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Hand, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { LucideIcon } from 'lucide-react'

type GameType = {
  id: string
  /** Tên thể loại game */
  name: string
  /** Mô tả ngắn về cách chơi */
  desc: string
  icon: LucideIcon
  /** Gradient nền của thẻ */
  gradient: string
  /** Màu chấm sáng trang trí (mờ) phía sau */
  glow: string
  /** Đường dẫn tới game (nếu đã làm xong). */
  to?: string
}

// Danh sách các *thể loại* game (cách chơi), không chia theo chủ đề toán.
// Mỗi thể loại gộp tất cả chủ đề và tăng dần độ khó.
const GAME_TYPES: GameType[] = [
  {
    id: 'dragdrop',
    name: 'Kéo thả đáp án',
    desc: 'Kéo đáp án đúng vào ô — độ khó tăng dần từ đếm số, hình dạng, so sánh đến phép tính',
    icon: Hand,
    gradient: 'from-indigo-400 to-violet-500',
    glow: 'bg-indigo-300',
    to: '/games/1/play',
  },
  {
    id: 'challenge',
    name: 'Thử thách đếm ngược',
    desc: '120 giây · 5 mạng · chọn đáp án A, B, C, D — độ khó tăng dần, mỗi câu đúng +1 xu',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
    glow: 'bg-amber-300',
    to: '/games/1/challenge',
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
            <p className="text-sm text-slate-500">Chọn một thể loại để bắt đầu</p>
          </div>
        </div>

        {/* Danh sách thể loại game (list dọc) */}
        <div className="flex flex-col gap-3">
          {GAME_TYPES.map(({ id, name, desc, icon: Icon, gradient, glow, to }, i) => (
            <button
              key={id}
              type="button"
              onClick={() => to && navigate({ to })}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`group animate-game-pop-in relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-4 text-left text-white shadow-lg shadow-slate-200/60 transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50`}
            >
              {/* Quầng sáng mờ */}
              <span
                className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full ${glow} opacity-40 blur-2xl`}
              />
              {/* Icon lớn mờ làm hình nền */}
              <Icon
                className="pointer-events-none absolute -bottom-4 right-2 text-white/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                size={96}
                strokeWidth={1.5}
              />

              {/* Icon trong huy hiệu kính mờ */}
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110">
                <Icon size={28} strokeWidth={2.2} />
              </span>

              {/* Tên + mô tả thể loại */}
              <span className="relative min-w-0 flex-1">
                <span className="block text-base font-bold leading-tight">{name}</span>
                <span className="mt-1 block text-xs leading-snug text-white/80">{desc}</span>
              </span>

              <ChevronRight className="relative shrink-0 text-white/70" size={22} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
