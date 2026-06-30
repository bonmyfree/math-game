import { useNavigate } from '@tanstack/react-router'
import { Check, ChevronLeft, RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'

import {
  CELEBRATIONS,
  getSelectedCelebration,
  setSelectedCelebration,
  type CelebrationId,
} from '../engine/celebrations'

export default function FireworksShowcasePage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<CelebrationId>(getSelectedCelebration)
  /** Khóa remount để "phát lại" hiệu ứng của từng thẻ. */
  const [replay, setReplay] = useState<Record<string, number>>({})

  const choose = (id: CelebrationId) => {
    setSelected(id)
    setSelectedCelebration(id)
  }

  const replayOne = (id: string) => setReplay((r) => ({ ...r, [id]: (r[id] ?? 0) + 1 }))

  return (
    <div className="relative -m-6 min-h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-b from-indigo-50 via-sky-50 to-white p-6 md:min-h-dvh">
      {/* Tiêu đề */}
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: '/games/$grade', params: { grade: '1' } })}
          aria-label="Quay lại"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="flex items-center gap-1.5 text-2xl font-bold text-slate-800">
            <Sparkles size={22} className="text-amber-500" />
            Hiệu ứng ăn mừng
          </h1>
          <p className="text-sm text-slate-500">Chạm để chọn hiệu ứng cho màn kết thúc game</p>
        </div>
      </div>

      {/* Lưới các hiệu ứng */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CELEBRATIONS.map(({ id, name, desc, Component }) => {
          const isSelected = selected === id
          return (
            <div
              key={id}
              className={`overflow-hidden rounded-3xl border-2 bg-white shadow-sm transition-all ${
                isSelected ? 'border-amber-400 shadow-amber-200/60' : 'border-slate-200'
              }`}
            >
              {/* Khung xem trước (nền tối như bầu trời đêm) */}
              <div className="relative h-44 overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800">
                <Component key={replay[id] ?? 0} />
                {/* Nội dung mô phỏng ngữ cảnh kết thúc */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-extrabold text-amber-600 shadow-lg">
                    🏆 +25 điểm
                  </span>
                </div>
                {/* Phát lại */}
                <button
                  type="button"
                  onClick={() => replayOne(id)}
                  aria-label="Phát lại"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow transition-transform hover:bg-white active:scale-90"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Thông tin + nút chọn */}
              <div className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-800">{name}</p>
                  <p className="truncate text-xs text-slate-500">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => choose(id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={16} />
                      Đã chọn
                    </>
                  ) : (
                    'Chọn'
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        Hiệu ứng đã chọn sẽ tự động dùng cho màn kết thúc của game Thử thách.
      </p>
    </div>
  )
}
