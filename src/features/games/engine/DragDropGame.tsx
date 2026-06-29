import { useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  Coins,
  Home,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useCoinsStore } from '@/shared/stores'

import { isMuted, playCorrect, playEnter, playWrong, setMuted, stopCorrect } from './sounds'

import type { GameOption, GameRound, RoundGenerator } from './types'
import type { ReactNode } from 'react'

/** Xu thưởng cho mỗi câu trả lời đúng. */
const COINS_PER_CORRECT = 1
/** Xu thưởng thêm khi hoàn thành toàn bộ game. */
const COINS_WIN_BONUS = 10

type Props = {
  /** Tên game hiển thị ở tiêu đề. */
  title: string
  /** Mô tả ngắn dưới tiêu đề. */
  subtitle: string
  /** Hàm sinh câu hỏi. */
  generate: RoundGenerator
  /**
   * Số câu cần trả lời đúng để chiến thắng. Có giá trị → game hữu hạn, trả lời
   * đủ sẽ hiện màn chúc mừng. Bỏ trống → game chơi không giới hạn (vô tận).
   */
  totalRounds?: number
}

type DragState = { id: string; label: ReactNode; x: number; y: number } | null
type Status = 'idle' | 'correct' | 'wrong'

/** Dải pháo giấy cho màn chúc mừng (màu + lệch ngang + thời lượng khác nhau). */
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 37) % 100,
  color: ['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-sky-400', 'bg-violet-400'][i % 5],
  delay: (i % 8) * 0.25,
  duration: 2.2 + (i % 5) * 0.4,
  size: 8 + (i % 3) * 4,
}))

export function DragDropGame({ title, subtitle, generate, totalRounds }: Props) {
  const navigate = useNavigate()
  const addCoins = useCoinsStore((s) => s.addCoins)

  const [round, setRound] = useState<GameRound>(() => generate(0))
  const [roundId, setRoundId] = useState(0)
  /** Bậc độ khó hiện tại = số câu đã trả lời đúng (dùng cho game tăng dần). */
  const levelRef = useRef(0)
  const [status, setStatus] = useState<Status>('idle')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  /** Đã hoàn thành đủ `totalRounds` câu → hiện màn chúc mừng. */
  const [won, setWon] = useState(false)
  /** id của ô vừa bị kéo sai (để lắc + tô đỏ tạm thời). */
  const [wrongId, setWrongId] = useState<string | null>(null)
  /** Trạng thái kéo hiện tại (để vẽ "bóng ma" đi theo ngón tay). */
  const [drag, setDrag] = useState<DragState>(null)
  /** Ngón tay/chuột đang ở trên vùng thả hay không. */
  const [overDrop, setOverDrop] = useState(false)
  const [muted, setMutedState] = useState(isMuted)

  const dropRef = useRef<HTMLDivElement>(null)
  // Giữ bản mới nhất cho các listener gắn 1 lần, tránh closure cũ.
  const dragRef = useRef<DragState>(null)
  const roundRef = useRef(round)
  useEffect(() => {
    roundRef.current = round
  }, [round])

  // Tiếng chuông khi vào game (điều hướng từ một cú chạm nên audio được mở khóa).
  useEffect(() => {
    playEnter()
  }, [])

  const nextRound = useCallback(() => {
    stopCorrect() // tắt tiếng "yeah" khi sang câu mới
    setStatus('idle')
    setWrongId(null)
    setRound(generate(levelRef.current))
    setRoundId((n) => n + 1)
  }, [generate])

  const handleDrop = useCallback(
    (id: string) => {
      if (id === roundRef.current.answerId) {
        playCorrect()
        setStatus('correct')
        levelRef.current += 1
        addCoins(COINS_PER_CORRECT)
        setScore((s) => s + 1)
        setStreak((s) => s + 1)
        if (totalRounds && levelRef.current >= totalRounds) {
          addCoins(COINS_WIN_BONUS)
          window.setTimeout(() => setWon(true), 1200)
        } else {
          window.setTimeout(nextRound, 1200)
        }
      } else {
        playWrong()
        setStatus('wrong')
        setStreak(0)
        setWrongId(id)
        window.setTimeout(() => {
          setStatus('idle')
          setWrongId(null)
        }, 600)
      }
    },
    [nextRound, totalRounds, addCoins],
  )
  const handleDropRef = useRef(handleDrop)
  useEffect(() => {
    handleDropRef.current = handleDrop
  }, [handleDrop])

  const isInsideDrop = (clientX: number, clientY: number) => {
    const rect = dropRef.current?.getBoundingClientRect()
    if (!rect) return false
    return (
      clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    )
  }

  // Gắn listener kéo–thả toàn cục một lần. Dùng pointer events nên chạy tốt cả
  // chuột lẫn cảm ứng (mobile).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return
      e.preventDefault()
      const next = { ...dragRef.current, x: e.clientX, y: e.clientY }
      dragRef.current = next
      setDrag(next)
      setOverDrop(isInsideDrop(e.clientX, e.clientY))
    }
    const onUp = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const inside = isInsideDrop(e.clientX, e.clientY)
      dragRef.current = null
      setDrag(null)
      setOverDrop(false)
      if (inside) handleDropRef.current(d.id)
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [])

  const startDrag = (opt: GameOption) => (e: React.PointerEvent) => {
    if (status === 'correct') return
    const d = { id: opt.id, label: opt.label, x: e.clientX, y: e.clientY }
    dragRef.current = d
    setDrag(d)
    setOverDrop(isInsideDrop(e.clientX, e.clientY))
  }

  const restart = () => {
    levelRef.current = 0
    setScore(0)
    setStreak(0)
    setWon(false)
    nextRound()
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  const correctLabel = round.options.find((o) => o.id === round.answerId)?.label

  // Ô đáp án (slot) do engine cấp cho generator đặt vào thẻ.
  const slot =
    status === 'correct' ? (
      <span className="animate-game-pop flex h-16 min-w-16 items-center justify-center rounded-2xl bg-emerald-500 px-2 text-white shadow-lg">
        {correctLabel}
      </span>
    ) : (
      <span
        className={`flex h-16 min-w-16 items-center justify-center rounded-2xl border-4 border-dashed text-3xl font-extrabold transition-colors ${
          overDrop
            ? 'border-indigo-400 bg-indigo-100 text-indigo-500'
            : 'border-slate-300 text-slate-300'
        }`}
      >
        ?
      </span>
    )

  return (
    <div className="relative -m-6 flex min-h-[calc(100dvh-4rem)] touch-none flex-col overflow-hidden bg-gradient-to-b from-indigo-50 via-sky-50 to-white p-6 select-none md:min-h-dvh">
      {/* Trang trí nền mờ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -left-10 -top-12 h-44 w-44 rounded-full border-[12px] border-indigo-200/50" />
        <span className="absolute -right-8 top-28 h-28 w-28 rotate-12 rounded-3xl bg-sky-200/40" />
        <span className="absolute bottom-40 left-6 h-0 w-0 -rotate-12 border-x-[28px] border-b-[48px] border-x-transparent border-b-violet-200/50" />
      </div>

      {/* Header */}
      <div className="relative mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate({ to: '/games/$grade', params: { grade: '1' } })}
          aria-label="Quay lại"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <Star size={18} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-700">
            {score}
            {totalRounds ? `/${totalRounds}` : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          type="button"
          onClick={restart}
          aria-label="Chơi lại từ đầu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Câu hỏi */}
      <p className="relative mb-3 text-center text-base font-semibold text-slate-700">
        {round.question}
      </p>

      {/* Vùng thả */}
      <div
        ref={dropRef}
        className={`relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center rounded-[2rem] border-4 border-dashed bg-white/70 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-sm transition-all duration-200 ${
          status === 'wrong'
            ? 'animate-game-shake border-rose-300 bg-rose-50/80'
            : status === 'correct'
              ? 'border-emerald-300 bg-emerald-50/80'
              : overDrop
                ? 'scale-[1.02] border-indigo-400 bg-indigo-50/80'
                : 'border-slate-200'
        }`}
      >
        <div key={roundId} className="flex w-full flex-col items-center justify-center">
          {round.renderPrompt(slot)}
        </div>

        {status === 'correct' && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="animate-game-pop flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-lg font-bold text-white shadow-xl">
              <Sparkles size={20} className="fill-white" />
              {streak >= 3 ? `Tuyệt vời! ${streak} câu liền!` : 'Giỏi quá!'}
            </div>
          </div>
        )}
      </div>

      {/* Hàng ô để kéo */}
      <div className="relative mt-5 mb-2 flex flex-wrap items-center justify-center gap-3">
        {round.options.map((opt) => {
          const isDragging = drag?.id === opt.id
          const isWrong = wrongId === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onPointerDown={startDrag(opt)}
              disabled={status === 'correct'}
              className={`flex h-20 min-w-20 touch-none items-center justify-center rounded-3xl bg-gradient-to-br px-4 text-center text-white shadow-lg transition-all duration-150 active:scale-95 disabled:opacity-40 ${
                isWrong
                  ? 'animate-game-shake from-rose-400 to-red-500'
                  : 'from-indigo-400 to-violet-500'
              } ${isDragging ? 'scale-90 opacity-30' : 'hover:-translate-y-1'}`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Bóng ma đi theo ngón tay khi kéo */}
      {drag && (
        <div
          className="pointer-events-none fixed z-50 flex h-20 min-w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 px-4 text-center text-white shadow-2xl"
          style={{ left: drag.x, top: drag.y, transform: 'translate(-50%, -50%) rotate(-6deg)' }}
        >
          {drag.label}
        </div>
      )}

      {/* Màn chúc mừng chiến thắng */}
      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm">
          {/* Pháo giấy rơi */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className={`animate-game-confetti absolute top-0 rounded-sm ${c.color}`}
                style={{
                  left: `${c.left}%`,
                  width: c.size,
                  height: c.size,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`,
                }}
              />
            ))}
          </div>

          {/* Thẻ chúc mừng */}
          <div className="animate-game-pop relative w-full max-w-xs rounded-[2rem] bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Trophy size={40} className="text-white" strokeWidth={2.2} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Chúc mừng! 🎉</h2>
            <p className="mt-1 text-sm text-slate-500">
              Bé đã hoàn thành tất cả {totalRounds} câu hỏi!
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <span className="text-base font-bold text-amber-600">{score} điểm</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-2">
                <Coins size={18} className="text-yellow-500" />
                <span className="text-base font-bold text-yellow-600">
                  +{score * COINS_PER_CORRECT + COINS_WIN_BONUS} xu
                </span>
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: '/games/$grade', params: { grade: '1' } })}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-200 active:scale-95"
              >
                <Home size={18} />
                Trang chủ
              </button>
              <button
                type="button"
                onClick={restart}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-3 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <RotateCcw size={18} />
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
