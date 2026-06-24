import { useNavigate } from '@tanstack/react-router'
import { Sprout, Star, Rocket, Crown, GraduationCap, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { LucideIcon } from 'lucide-react'

type GradeCard = {
  grade: number
  icon: LucideIcon
  /** Gradient nền của thẻ */
  gradient: string
  /** Màu chấm trang trí (mờ) phía sau */
  glow: string
}

const GRADES: GradeCard[] = [
  { grade: 1, icon: Sprout, gradient: 'from-rose-400 to-pink-500', glow: 'bg-rose-300' },
  { grade: 2, icon: Star, gradient: 'from-amber-400 to-orange-500', glow: 'bg-amber-300' },
  { grade: 3, icon: Rocket, gradient: 'from-emerald-400 to-teal-500', glow: 'bg-emerald-300' },
  { grade: 4, icon: Crown, gradient: 'from-sky-400 to-blue-500', glow: 'bg-sky-300' },
  {
    grade: 5,
    icon: GraduationCap,
    gradient: 'from-violet-400 to-purple-500',
    glow: 'bg-violet-300',
  },
]

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="relative -m-6 min-h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-b from-indigo-50 via-sky-50 to-white p-6 md:min-h-dvh">
      {/* Background chủ đề toán học: các hình khối hình học mờ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Vòng tròn viền lớn */}
        <span className="absolute -left-10 -top-12 h-44 w-44 rounded-full border-[12px] border-indigo-200/50" />
        {/* Hình vuông bo góc xoay */}
        <span className="absolute -right-8 top-24 h-32 w-32 rotate-12 rounded-3xl bg-sky-200/40" />
        {/* Tam giác */}
        <span className="absolute bottom-40 left-8 h-0 w-0 -rotate-12 border-x-[30px] border-b-[52px] border-x-transparent border-b-violet-200/50" />
        {/* Hình tròn đặc */}
        <span className="absolute bottom-16 -right-6 h-28 w-28 rounded-full bg-amber-200/40" />
        {/* Vòng tròn viền nhỏ */}
        <span className="absolute bottom-24 left-1/2 h-16 w-16 rounded-full border-[8px] border-rose-200/50" />
        {/* Chấm tròn điểm xuyết */}
        <span className="absolute right-12 top-10 h-3 w-3 rounded-full bg-indigo-300/60" />
        <span className="absolute left-1/3 top-1/2 h-2.5 w-2.5 rounded-full bg-emerald-300/60" />
      </div>

      {/* Nội dung */}
      <div className="relative">
        {/* Tiêu đề */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{t('home.greeting')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('home.pickGrade')}</p>
        </div>

        {/* Lưới các lớp */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {GRADES.map(({ grade, icon: Icon, gradient, glow }, i) => (
            <button
              key={grade}
              type="button"
              onClick={() => navigate({ to: '/games/$grade', params: { grade: String(grade) } })}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`group animate-game-pop-in relative flex h-44 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-4 text-left text-white shadow-lg shadow-slate-200/60 transition-all duration-300 active:scale-[0.97] hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50`}
            >
              {/* Chấm trang trí mờ */}
              <span
                className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full ${glow} opacity-40 blur-2xl`}
              />
              {/* Icon lớn mờ làm hình nền */}
              <Icon
                className="pointer-events-none absolute -bottom-5 -right-4 text-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                size={108}
                strokeWidth={1.5}
              />

              {/* Hàng trên: số lớp (trái) + icon huy hiệu (phải) */}
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                    {t('home.gradeLabel')}
                  </p>
                  <p className="text-5xl font-black leading-none">{grade}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm ring-1 ring-white/40">
                  <Icon size={22} strokeWidth={2.2} />
                </span>
              </div>

              {/* Nút Vào học dạng pill */}
              <span className="relative inline-flex items-center justify-center gap-1 self-start rounded-full bg-white/20 px-3.5 py-1.5 text-sm font-bold backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/30">
                {t('home.play')}
                <ChevronRight
                  size={15}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
