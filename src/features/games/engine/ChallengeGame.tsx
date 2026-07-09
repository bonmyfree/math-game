import { useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  Clock,
  Coins,
  Crown,
  Heart,
  Home,
  Medal,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useCoinsStore } from '@/shared/stores'

import { Celebration } from './celebrationEffects'
import { getSelectedCelebration } from './celebrations'
import {
  isMuted,
  playCorrect,
  playEnter,
  playWin,
  playWrong,
  setMuted,
  stopCorrect,
} from './sounds'

import type { ChallengeGenerator, ChallengeRound } from './types'

/** Xu thưởng cho mỗi câu trả lời đúng. */
const COINS_PER_CORRECT = 1
/** Số mạng (trái tim) mỗi lượt chơi. */
const TOTAL_LIVES = 5
/** Thời gian đếm ngược cho mỗi lượt chơi (giây). */
const TOTAL_SECONDS = 180
/** Số câu mỗi bậc độ khó (đồng bộ với generator). */
const QUESTIONS_PER_STAGE = 3
/** Nhãn cho 4 lựa chọn. */
const LETTERS = ['A', 'B', 'C', 'D'] as const
/** Thời gian giữ phản hồi (ms) trước khi sang câu mới — đúng thì nhanh, sai giữ lâu hơn chút để bé kịp thấy đáp án đúng. */
const CORRECT_DELAY_MS = 450
const WRONG_DELAY_MS = 650

/** Khóa lưu điểm cao nhất của game thử thách trong localStorage. */
const BEST_KEY = 'mathgame.challenge.best'

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

function writeBest(value: number) {
  try {
    localStorage.setItem(BEST_KEY, String(value))
  } catch {
    // Bỏ qua nếu không truy cập được localStorage.
  }
}

type Props = {
  /** Tên game hiển thị ở tiêu đề. */
  title: string
  /** Mô tả ngắn dưới tiêu đề. */
  subtitle: string
  /** Hàm sinh câu hỏi trắc nghiệm theo bậc độ khó. */
  generate: ChallengeGenerator
  /** Lớp đang chơi — dùng để quay lại đúng danh sách game của lớp. */
  grade?: string
}

type EndReason = 'time' | 'lives'

/** Định dạng giây → "m:ss". */
function formatTime(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ChallengeGame({ title, subtitle, generate, grade = '1' }: Props) {
  const navigate = useNavigate()
  const addCoins = useCoinsStore((s) => s.addCoins)

  const [round, setRound] = useState<ChallengeRound>(() => generate(0))
  /** Số câu đã hiện ra — dùng cho độ khó tăng dần. */
  const [qIndex, setQIndex] = useState(0)
  const qIndexRef = useRef(0)
  const [lives, setLives] = useState(TOTAL_LIVES)
  const livesRef = useRef(TOTAL_LIVES)
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const timeRef = useRef(TOTAL_SECONDS)
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  /** id đáp án bé vừa chọn (để tô màu sau khi trả lời). */
  const [picked, setPicked] = useState<string | null>(null)
  /** Đã chốt đáp án câu này chưa (khóa thao tác trong lúc chờ sang câu mới). */
  const [answered, setAnswered] = useState(false)
  const [over, setOver] = useState(false)
  const [reason, setReason] = useState<EndReason>('time')
  /** Điểm cao nhất từ trước tới nay (lưu trong localStorage). */
  const [best, setBest] = useState(readBest)
  /** Lượt chơi này có phá kỷ lục không (để hiện huy hiệu). */
  const [isRecord, setIsRecord] = useState(false)
  const [muted, setMutedState] = useState(isMuted)

  const timeoutRef = useRef<number | undefined>(undefined)

  // Kết thúc lượt chơi: chốt điểm cao, phát nhạc chiến thắng, hiện màn tổng kết.
  const finalize = useCallback((r: EndReason) => {
    window.clearTimeout(timeoutRef.current)
    const final = scoreRef.current
    if (final > readBest()) {
      writeBest(final)
      setBest(final)
      setIsRecord(true)
    }
    setReason(r)
    setOver(true)
    playWin()
  }, [])

  // Tiếng chuông khi vào game (điều hướng từ một cú chạm nên audio đã được mở khóa).
  useEffect(() => {
    playEnter()
  }, [])

  // Đếm ngược thời gian. Khi chạm 0 thì kết thúc lượt chơi.
  useEffect(() => {
    if (over) return
    const id = window.setInterval(() => {
      timeRef.current -= 1
      setTimeLeft(timeRef.current)
      if (timeRef.current <= 0) {
        window.clearInterval(id)
        finalize('time')
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [over, finalize])

  // Dọn dẹp timeout khi rời trang.
  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const next = useCallback(() => {
    stopCorrect()
    qIndexRef.current += 1
    setQIndex(qIndexRef.current)
    setRound(generate(qIndexRef.current))
    setPicked(null)
    setAnswered(false)
  }, [generate])

  const answer = useCallback(
    (id: string) => {
      if (answered || over) return
      setPicked(id)
      setAnswered(true)

      if (id === round.answerId) {
        playCorrect()
        addCoins(COINS_PER_CORRECT)
        scoreRef.current += 1
        setScore(scoreRef.current)
        timeoutRef.current = window.setTimeout(next, CORRECT_DELAY_MS)
        return
      }

      // Sai → trừ 1 mạng.
      playWrong()
      const remaining = livesRef.current - 1
      livesRef.current = remaining
      setLives(remaining)
      if (remaining <= 0) {
        timeoutRef.current = window.setTimeout(() => finalize('lives'), WRONG_DELAY_MS)
      } else {
        timeoutRef.current = window.setTimeout(next, WRONG_DELAY_MS)
      }
    },
    [answered, over, round.answerId, addCoins, next, finalize],
  )

  const restart = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    stopCorrect()
    qIndexRef.current = 0
    livesRef.current = TOTAL_LIVES
    timeRef.current = TOTAL_SECONDS
    scoreRef.current = 0
    setQIndex(0)
    setLives(TOTAL_LIVES)
    setTimeLeft(TOTAL_SECONDS)
    setScore(0)
    setPicked(null)
    setAnswered(false)
    setIsRecord(false)
    setOver(false)
    setRound(generate(0))
  }, [generate])

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    setMutedState(nextMuted)
  }

  const stage = Math.floor(qIndex / QUESTIONS_PER_STAGE) + 1
  const lowTime = timeLeft <= 10

  return (
    <div className="relative -m-6 flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-gradient-to-b from-indigo-50 via-sky-50 to-white p-6 select-none md:min-h-dvh">
      {/* Trang trí nền mờ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -left-10 -top-12 h-44 w-44 rounded-full border-[12px] border-indigo-200/50" />
        <span className="absolute -right-8 top-28 h-28 w-28 rotate-12 rounded-3xl bg-sky-200/40" />
        <span className="absolute bottom-40 left-6 h-0 w-0 -rotate-12 border-x-[28px] border-b-[48px] border-x-transparent border-b-violet-200/50" />
      </div>

      {/* Header */}
      <div className="relative mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate({ to: '/games/$grade', params: { grade } })}
          aria-label="Quay lại"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: '/games/fireworks' })}
          aria-label="Chọn hiệu ứng ăn mừng"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-amber-500 shadow-sm transition-colors hover:bg-slate-50 active:scale-95"
        >
          <Sparkles size={18} />
        </button>
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

      {/* Thanh trạng thái: thời gian · mạng · điểm */}
      <div className="relative mb-4 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold shadow-sm transition-colors ${
            lowTime ? 'animate-game-shake bg-rose-100 text-rose-600' : 'bg-white text-slate-700'
          }`}
        >
          <Clock size={16} className={lowTime ? 'text-rose-500' : 'text-indigo-500'} />
          {formatTime(timeLeft)}
        </span>

        <span className="flex items-center gap-0.5">
          {Array.from({ length: TOTAL_LIVES }).map((_, i) => (
            <Heart
              key={i}
              size={20}
              className={
                i < lives
                  ? 'fill-rose-500 text-rose-500 transition-transform'
                  : 'fill-slate-200 text-slate-200'
              }
            />
          ))}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-yellow-600 shadow-sm">
          <Coins size={16} className="text-yellow-500" />
          {score}
        </span>
      </div>

      {/* Cấp độ + câu số */}
      <p className="relative mb-2 text-center text-xs font-semibold tracking-wide text-slate-400">
        CẤP {stage} · CÂU {qIndex + 1}
      </p>

      {/* Đề bài */}
      <div className="relative mx-auto mb-5 flex w-full max-w-md flex-1 items-center justify-center overflow-y-auto rounded-[2rem] border-4 border-dashed border-slate-200 bg-white/70 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-sm">
        <div key={qIndex} className="animate-game-pop flex flex-col items-center justify-center">
          {round.question}
        </div>
      </div>

      {/* 4 đáp án A · B · C · D */}
      <div className="relative grid grid-cols-2 gap-3 pb-2">
        {round.options.map((opt, i) => {
          const isAnswer = opt.id === round.answerId
          const isPicked = picked === opt.id
          let tone =
            'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-indigo-300'
          if (answered) {
            if (isAnswer) tone = 'border-emerald-400 bg-emerald-50 text-emerald-700'
            else if (isPicked) tone = 'animate-game-shake border-rose-400 bg-rose-50 text-rose-600'
            else tone = 'border-slate-200 bg-white text-slate-300'
          }
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => answer(opt.id)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-3xl border-2 p-4 text-left shadow-sm transition-all duration-150 active:scale-[0.97] disabled:cursor-default ${tone}`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-extrabold transition-colors ${
                  answered && isAnswer
                    ? 'bg-emerald-500 text-white'
                    : answered && isPicked
                      ? 'bg-rose-500 text-white'
                      : 'bg-indigo-100 text-indigo-600'
                }`}
              >
                {LETTERS[i]}
              </span>
              <span className="flex flex-1 items-center justify-center">{opt.label}</span>
            </button>
          )
        })}
      </div>

      {/* Màn kết thúc */}
      {over && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="animate-game-pop relative z-0 w-full max-w-xs rounded-[2rem] bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Trophy size={40} className="text-white" strokeWidth={2.2} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              {reason === 'time' ? 'Hết giờ! ⏰' : 'Hết mạng! 💔'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Bé đã trả lời đúng {score} câu. Cố lên nào!
            </p>

            {/* Huy hiệu phá kỷ lục */}
            {isRecord && (
              <div className="mt-3 inline-flex animate-game-pop items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-sm font-extrabold text-white shadow-md">
                <Crown size={16} className="fill-white" />
                Kỷ lục mới!
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2">
                <Trophy size={18} className="text-amber-500" />
                <span className="text-base font-bold text-amber-600">{score} điểm</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-2">
                <Coins size={18} className="text-yellow-500" />
                <span className="text-base font-bold text-yellow-600">
                  +{score * COINS_PER_CORRECT} xu
                </span>
              </span>
            </div>

            {/* Điểm cao nhất */}
            <div className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 px-4 py-2">
              <Medal size={18} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Kỷ lục: {best} điểm</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: '/games/$grade', params: { grade } })}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-bold whitespace-nowrap text-slate-600 transition-colors hover:bg-slate-200 active:scale-95"
              >
                <Home size={18} className="shrink-0" />
                Trang chủ
              </button>
              <button
                type="button"
                onClick={restart}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 px-3 py-3 text-sm font-bold whitespace-nowrap text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <RotateCcw size={18} className="shrink-0" />
                Chơi lại
              </button>
            </div>
          </div>

          {/* Pháo hoa nằm trên cùng (đè lên cả thẻ), không chặn thao tác chạm */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <Celebration id={getSelectedCelebration()} />
          </div>
        </div>
      )}
    </div>
  )
}
