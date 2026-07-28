import { useNavigate } from '@tanstack/react-router'
import {
  Camera,
  ChevronLeft,
  Coins,
  Home,
  RotateCcw,
  Swords,
  Trophy,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useCoinsStore } from '@/shared/stores'

import { Celebration } from './celebrationEffects'
import { getSelectedCelebration } from './celebrations'
import { renderSwollenFace } from './faceBulge'
import {
  isMuted,
  playCorrect,
  playEnter,
  playWin,
  playWrong,
  setMuted,
  stopCorrect,
} from './sounds'

import type { ChallengeGenerator, ChallengeRound, GameOption } from './types'

/** Xu thưởng mỗi hiệp (cộng vào ví chung). */
const COINS_PER_ROUND = 1
/** Xu thưởng thêm khi có người thắng trận. */
const COINS_MATCH_WIN = 5
/** Điểm cần để thắng trận. */
const WIN_SCORE = 5
/** Thời gian mỗi hiệp (giây) — hết giờ chưa ai đúng → cả hai bị đấm. */
const ROUND_SECONDS = 10
const LETTERS = ['A', 'B', 'C', 'D'] as const
/** Giữ phản hồi / hiệu ứng đấm trước khi sang hiệp mới. */
const ROUND_DELAY_MS = 1400
/** Thời gian flash nắm đấm (ms) — mức sưng giữ cả trận. */
const PUNCH_HIT_MS = 650
/** Mức sưng tối đa (tăng dần mỗi lần bị đấm). */
const MAX_SWELL = 5

type PlayerId = 'a' | 'b'
type RoundWinner = PlayerId | 'draw' | null
type Phase = 'lobby' | 'playing'

type Props = {
  title: string
  subtitle: string
  generate: ChallengeGenerator
  grade?: string
}

type PanelTone = {
  bg: string
  accent: string
  ring: string
  badge: string
  btn: string
  btnIdle: string
  border: string
}

const TONE_A: PanelTone = {
  bg: 'bg-gradient-to-b from-sky-100 to-sky-50',
  accent: 'text-sky-700',
  ring: 'ring-sky-300',
  badge: 'bg-sky-500',
  btn: 'bg-sky-100 text-sky-700',
  btnIdle: 'hover:border-sky-300',
  border: 'border-sky-200',
}

const TONE_B: PanelTone = {
  bg: 'bg-gradient-to-b from-violet-100 to-violet-50',
  accent: 'text-violet-700',
  ring: 'ring-violet-300',
  badge: 'bg-violet-500',
  btn: 'bg-violet-100 text-violet-700',
  btnIdle: 'hover:border-violet-300',
  border: 'border-violet-200',
}

/** Avatar lớn — mặt sưng bằng biến dạng pixel (bulge), không chỉ tô màu. */
function PunchAvatar({
  photoUrl,
  punched,
  swell,
  tone,
  size = 'xl',
}: {
  photoUrl: string | null
  punched: boolean
  swell: number
  tone: PanelTone
  size?: 'md' | 'xl' | '2xl'
}) {
  const sizeCls =
    size === '2xl' ? 'h-28 w-28 sm:h-32 sm:w-32' : size === 'md' ? 'h-16 w-16' : 'h-24 w-24'
  const cssPx = size === '2xl' ? 128 : size === 'md' ? 64 : 96
  const iconSize = size === '2xl' ? 52 : size === 'md' ? 28 : 44
  const fistCls = size === 'md' ? 'text-3xl' : 'text-5xl'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null)

  // Load ảnh + vẽ lại khi swell đổi.
  useEffect(() => {
    if (!photoUrl) {
      imgRef.current = null
      return
    }

    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (cancelled) return
      imgRef.current = img
      setLoadedUrl(photoUrl)
    }
    img.onerror = () => {
      if (cancelled) return
      imgRef.current = null
      setLoadedUrl(null)
    }
    img.src = photoUrl

    return () => {
      cancelled = true
    }
  }, [photoUrl])

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || loadedUrl !== photoUrl) return
    renderSwollenFace(canvas, img, swell, cssPx)
  }, [swell, loadedUrl, cssPx, photoUrl])

  // Phồng nhẹ khung theo mức (bổ sung cho bulge pixel).
  const frameScale = 1 + Math.min(5, swell) * 0.035
  const leftHeavy = swell % 2 === 1

  return (
    <div className={`relative shrink-0 ${sizeCls} ${punched ? 'animate-game-shake' : ''}`}>
      <div
        className={`relative h-full w-full overflow-hidden rounded-full shadow-lg ring-4 ring-white ${tone.badge} ${
          punched ? 'animate-game-face-swell-hit' : ''
        }`}
        style={{
          transform: swell > 0 ? `scale(${frameScale})` : undefined,
          transition: 'transform 0.45s ease-out',
          borderRadius:
            swell > 0
              ? `${46 - swell}% ${54 + swell}% ${52 + swell * 0.5}% ${48 - swell * 0.5}% / ${48 - swell * 0.6}% ${44 - swell}% ${56 + swell}% ${52 + swell * 0.4}%`
              : '50%',
        }}
      >
        {photoUrl && loadedUrl === photoUrl ? (
          <canvas
            ref={canvasRef}
            className="h-full w-full"
            style={{ width: '100%', height: '100%' }}
            aria-hidden
          />
        ) : photoUrl ? (
          <img src={photoUrl} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-white">
            <User size={iconSize} />
          </span>
        )}

        {/* Highlight bóng trên má phồng — gợi khối 3D, rất mỏng */}
        {swell > 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                `radial-gradient(ellipse 28% 24% at ${leftHeavy ? 26 : 30}% 48%, rgba(255,255,255,${0.08 + swell * 0.03}) 0%, transparent 70%)`,
                `radial-gradient(ellipse 26% 22% at ${leftHeavy ? 72 : 76}% 46%, rgba(255,255,255,${0.06 + swell * 0.025}) 0%, transparent 70%)`,
                `radial-gradient(ellipse 50% 40% at 50% 100%, rgba(0,0,0,${0.08 + swell * 0.03}) 0%, transparent 65%)`,
              ].join(', '),
            }}
          />
        )}
      </div>

      {punched && (
        <>
          <span
            aria-hidden
            className="animate-game-punch-flash pointer-events-none absolute inset-0 rounded-full bg-rose-500"
          />
          <span
            aria-hidden
            key={`fist-${swell}-${punched}`}
            className={`animate-game-punch-fist pointer-events-none absolute inset-0 flex items-center justify-center drop-shadow-lg ${fistCls}`}
          >
            👊
          </span>
          {swell >= 3 && (
            <span
              aria-hidden
              className="animate-game-punch-stars pointer-events-none absolute -top-1 right-0 text-lg"
            >
              💫
            </span>
          )}
        </>
      )}

      {swell > 0 && (
        <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow ring-2 ring-white">
          {swell}
        </span>
      )}
    </div>
  )
}

/** Chọn / chụp ảnh trong lobby. */
function PhotoPicker({
  photoUrl,
  onChange,
  tone,
  label,
}: {
  photoUrl: string | null
  onChange: (url: string | null) => void
  tone: PanelTone
  label: string
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    if (photoUrl?.startsWith('blob:')) URL.revokeObjectURL(photoUrl)
    onChange(url)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={label}
        className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed ${tone.border} bg-white shadow-sm active:scale-95`}
      >
        {photoUrl ? (
          <img src={photoUrl} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <span className={`flex flex-col items-center gap-0.5 ${tone.accent}`}>
            <Camera size={20} />
            <span className="text-[9px] font-bold">Ảnh</span>
          </span>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold ${tone.accent}`}>{label}</p>
        <p className="text-[11px] text-slate-400">Chạm để chọn hoặc chụp ảnh</p>
        {photoUrl && (
          <button
            type="button"
            onClick={() => {
              if (photoUrl.startsWith('blob:')) URL.revokeObjectURL(photoUrl)
              onChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="mt-0.5 text-[11px] font-bold text-rose-500"
          >
            Xóa ảnh
          </button>
        )}
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  )
}

type PlayerPanelProps = {
  name: string
  photoUrl: string | null
  punched: boolean
  swell: number
  score: number
  tone: PanelTone
  round: ChallengeRound
  qIndex: number
  timeLeft: number
  myPicked: string | null
  locked: boolean
  resolved: boolean
  roundWinner: RoundWinner
  myId: PlayerId
  disabled: boolean
  onAnswer: (id: string) => void
}

function PlayerPanel({
  name,
  photoUrl,
  punched,
  swell,
  score,
  tone,
  round,
  qIndex,
  timeLeft,
  myPicked,
  locked,
  resolved,
  roundWinner,
  myId,
  disabled,
  onAnswer,
}: PlayerPanelProps) {
  const wonRound = resolved && roundWinner === myId
  const lostRound =
    resolved && roundWinner !== null && roundWinner !== 'draw' && roundWinner !== myId
  const lowTime = timeLeft <= 3 && !resolved

  return (
    <div className={`flex h-full min-h-0 flex-col ${tone.bg} px-3 pb-2 pt-1.5`}>
      {/* Avatar lớn + tên + điểm */}
      <div className="mb-1 flex shrink-0 items-center gap-3">
        <PunchAvatar photoUrl={photoUrl} punched={punched} swell={swell} tone={tone} size="xl" />
        <div className="min-w-0 flex-1">
          <p className={`truncate text-base font-extrabold ${tone.accent}`}>{name}</p>
          <p className="text-[11px] font-semibold text-slate-400">
            {wonRound && 'Thắng hiệp!'}
            {lostRound && (swell > 0 ? `Thua — sưng mức ${swell}!` : 'Thua hiệp!')}
            {resolved && roundWinner === 'draw' && 'Hòa — cả hai bị đấm!'}
            {!resolved && locked && 'Đã chọn'}
            {!resolved && !locked && 'Chọn đáp án!'}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`flex h-8 min-w-8 items-center justify-center rounded-xl bg-white px-2 text-base font-extrabold shadow-sm ${tone.accent}`}
            >
              {score}
            </span>
            <span
              className={`text-xs font-bold tabular-nums ${
                lowTime ? 'animate-game-shake text-rose-500' : 'text-slate-400'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Đề bài */}
      <div className="mb-2 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/80 bg-white/70 px-3 py-2">
        <div
          key={qIndex}
          className="animate-game-pop flex max-h-full origin-center scale-[0.85] flex-col items-center justify-center sm:scale-100"
        >
          {round.question}
        </div>
      </div>

      {/* 4 đáp án */}
      <div className="grid shrink-0 grid-cols-2 gap-1.5">
        {round.options.map((opt, i) => (
          <AnswerButton
            key={opt.id}
            opt={opt}
            letter={LETTERS[i]}
            answerId={round.answerId}
            myPicked={myPicked}
            locked={locked}
            resolved={resolved}
            disabled={disabled}
            tone={tone}
            onAnswer={onAnswer}
          />
        ))}
      </div>
    </div>
  )
}

function AnswerButton({
  opt,
  letter,
  answerId,
  myPicked,
  locked,
  resolved,
  disabled,
  tone,
  onAnswer,
}: {
  opt: GameOption
  letter: string
  answerId: string
  myPicked: string | null
  locked: boolean
  resolved: boolean
  disabled: boolean
  tone: PanelTone
  onAnswer: (id: string) => void
}) {
  const isAnswer = opt.id === answerId
  const isPicked = myPicked === opt.id
  let toneCls = `border-slate-200 bg-white text-slate-700 ${tone.btnIdle}`
  if (resolved || locked) {
    if (isAnswer) toneCls = 'border-emerald-400 bg-emerald-50 text-emerald-700'
    else if (isPicked) toneCls = 'animate-game-shake border-rose-400 bg-rose-50 text-rose-600'
    else toneCls = 'border-slate-200 bg-white text-slate-300'
  }

  return (
    <button
      type="button"
      onClick={() => onAnswer(opt.id)}
      disabled={disabled || locked || resolved}
      className={`flex min-h-11 items-center gap-2 rounded-2xl border-2 px-2.5 py-2 text-left shadow-sm transition-all duration-150 active:scale-[0.97] disabled:cursor-default ${toneCls}`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
          (resolved || locked) && isAnswer
            ? 'bg-emerald-500 text-white'
            : (resolved || locked) && isPicked
              ? 'bg-rose-500 text-white'
              : tone.btn
        }`}
      >
        {letter}
      </span>
      <span className="flex flex-1 items-center justify-center text-sm font-bold">{opt.label}</span>
    </button>
  )
}

export function FightingGame({ title, subtitle, generate, grade = '2' }: Props) {
  const navigate = useNavigate()
  const addCoins = useCoinsStore((s) => s.addCoins)

  const [phase, setPhase] = useState<Phase>('lobby')
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [photoA, setPhotoA] = useState<string | null>(null)
  const [photoB, setPhotoB] = useState<string | null>(null)
  const [players, setPlayers] = useState<{ a: string; b: string } | null>(null)

  const [round, setRound] = useState<ChallengeRound>(() => generate(0))
  const [qIndex, setQIndex] = useState(0)
  const qIndexRef = useRef(0)

  const [scoreA, setScoreA] = useState(0)
  const scoreARef = useRef(0)
  const [scoreB, setScoreB] = useState(0)
  const scoreBRef = useRef(0)

  const [pickedA, setPickedA] = useState<string | null>(null)
  const [pickedB, setPickedB] = useState<string | null>(null)
  const lockedARef = useRef(false)
  const lockedBRef = useRef(false)
  const pickedARef = useRef<string | null>(null)
  const pickedBRef = useRef<string | null>(null)

  const [roundWinner, setRoundWinner] = useState<RoundWinner>(null)
  const [resolved, setResolved] = useState(false)
  const resolvedRef = useRef(false)

  const [punchedA, setPunchedA] = useState(false)
  const [punchedB, setPunchedB] = useState(false)
  const [swellA, setSwellA] = useState(0)
  const [swellB, setSwellB] = useState(0)
  const punchClearRef = useRef<number | undefined>(undefined)
  /** Mỗi hiệp chỉ tăng sưng 1 lần / người (tránh đếm kép sai + thua). */
  const damagedThisRoundRef = useRef({ a: false, b: false })

  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const timeRef = useRef(ROUND_SECONDS)

  const [matchOver, setMatchOver] = useState(false)
  const [matchWinner, setMatchWinner] = useState<PlayerId | null>(null)
  const [muted, setMutedState] = useState(isMuted)

  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    playEnter()
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(timeoutRef.current)
      window.clearTimeout(punchClearRef.current)
    }
  }, [])

  // Giải phóng blob URL cũ khi ảnh đổi hoặc component unmount.
  useEffect(() => {
    return () => {
      if (photoA?.startsWith('blob:')) URL.revokeObjectURL(photoA)
    }
  }, [photoA])

  useEffect(() => {
    return () => {
      if (photoB?.startsWith('blob:')) URL.revokeObjectURL(photoB)
    }
  }, [photoB])

  const leave = useCallback(() => {
    navigate({ to: '/games/$grade', params: { grade } })
  }, [navigate, grade])

  const triggerPunch = useCallback((targets: PlayerId[]) => {
    for (const t of targets) {
      if (damagedThisRoundRef.current[t]) continue
      damagedThisRoundRef.current[t] = true
      if (t === 'a') setSwellA((s) => Math.min(MAX_SWELL, s + 1))
      else setSwellB((s) => Math.min(MAX_SWELL, s + 1))
    }
    if (targets.includes('a')) setPunchedA(true)
    if (targets.includes('b')) setPunchedB(true)
    window.clearTimeout(punchClearRef.current)
    punchClearRef.current = window.setTimeout(() => {
      setPunchedA(false)
      setPunchedB(false)
    }, PUNCH_HIT_MS)
  }, [])

  const finishMatch = useCallback(
    (winner: PlayerId) => {
      window.clearTimeout(timeoutRef.current)
      setMatchWinner(winner)
      setMatchOver(true)
      addCoins(COINS_MATCH_WIN)
      playWin()
    },
    [addCoins],
  )

  const resetRoundState = useCallback(() => {
    lockedARef.current = false
    lockedBRef.current = false
    pickedARef.current = null
    pickedBRef.current = null
    resolvedRef.current = false
    damagedThisRoundRef.current = { a: false, b: false }
    timeRef.current = ROUND_SECONDS
    setPickedA(null)
    setPickedB(null)
    setRoundWinner(null)
    setResolved(false)
    setTimeLeft(ROUND_SECONDS)
    setPunchedA(false)
    setPunchedB(false)
    // Giữ swellA/swellB — mặt sưng tích lũy qua các hiệp.
  }, [])

  const resetMatchDamage = useCallback(() => {
    setSwellA(0)
    setSwellB(0)
    damagedThisRoundRef.current = { a: false, b: false }
  }, [])

  const scheduleNext = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      stopCorrect()
      if (scoreARef.current >= WIN_SCORE) {
        finishMatch('a')
        return
      }
      if (scoreBRef.current >= WIN_SCORE) {
        finishMatch('b')
        return
      }
      qIndexRef.current += 1
      setQIndex(qIndexRef.current)
      setRound(generate(qIndexRef.current))
      resetRoundState()
    }, ROUND_DELAY_MS)
  }, [generate, finishMatch, resetRoundState])

  const resolveRound = useCallback(
    (winner: Exclude<RoundWinner, null>) => {
      if (resolvedRef.current) return
      resolvedRef.current = true
      setResolved(true)
      setRoundWinner(winner)

      if (winner === 'a') {
        playCorrect()
        addCoins(COINS_PER_ROUND)
        scoreARef.current += 1
        setScoreA(scoreARef.current)
        triggerPunch(['b'])
      } else if (winner === 'b') {
        playCorrect()
        addCoins(COINS_PER_ROUND)
        scoreBRef.current += 1
        setScoreB(scoreBRef.current)
        triggerPunch(['a'])
      } else {
        playWrong()
        triggerPunch(['a', 'b'])
      }
      scheduleNext()
    },
    [addCoins, scheduleNext, triggerPunch],
  )

  // Đếm ngược mỗi hiệp.
  useEffect(() => {
    if (phase !== 'playing' || matchOver || resolved) return
    timeRef.current = ROUND_SECONDS
    const id = window.setInterval(() => {
      timeRef.current -= 1
      setTimeLeft(timeRef.current)
      if (timeRef.current <= 0) {
        window.clearInterval(id)
        resolveRound('draw')
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase, matchOver, resolved, qIndex, resolveRound])

  const answer = useCallback(
    (player: PlayerId, id: string) => {
      if (matchOver || resolvedRef.current) return
      const lockedRef = player === 'a' ? lockedARef : lockedBRef
      if (lockedRef.current) return

      lockedRef.current = true
      if (player === 'a') {
        pickedARef.current = id
        setPickedA(id)
      } else {
        pickedBRef.current = id
        setPickedB(id)
      }

      if (id === round.answerId) {
        resolveRound(player)
        return
      }

      // Sai → đấm ngay người đó; nếu cả hai đã sai thì hòa.
      triggerPunch([player])
      const otherLocked = player === 'a' ? lockedBRef.current : lockedARef.current
      const otherPicked = player === 'a' ? pickedBRef.current : pickedARef.current
      if (otherLocked && otherPicked !== round.answerId) {
        resolveRound('draw')
      } else {
        playWrong()
      }
    },
    [matchOver, resolveRound, triggerPunch, round.answerId],
  )

  const startMatch = useCallback(() => {
    const a = nameA.trim() || 'Người chơi 1'
    const b = nameB.trim() || 'Người chơi 2'
    setPlayers({ a, b })
    window.clearTimeout(timeoutRef.current)
    stopCorrect()
    qIndexRef.current = 0
    scoreARef.current = 0
    scoreBRef.current = 0
    setQIndex(0)
    setScoreA(0)
    setScoreB(0)
    setMatchWinner(null)
    setMatchOver(false)
    setRound(generate(0))
    resetMatchDamage()
    resetRoundState()
    setPhase('playing')
    playEnter()
  }, [nameA, nameB, generate, resetRoundState, resetMatchDamage])

  const rematch = useCallback(() => {
    if (!players) return
    window.clearTimeout(timeoutRef.current)
    stopCorrect()
    qIndexRef.current = 0
    scoreARef.current = 0
    scoreBRef.current = 0
    setQIndex(0)
    setScoreA(0)
    setScoreB(0)
    setMatchWinner(null)
    setMatchOver(false)
    setRound(generate(0))
    resetMatchDamage()
    resetRoundState()
    playEnter()
  }, [players, generate, resetRoundState, resetMatchDamage])

  const backToLobby = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    stopCorrect()
    setMatchOver(false)
    setMatchWinner(null)
    setPhase('lobby')
  }, [])

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    setMutedState(nextMuted)
  }

  const winnerName = matchWinner && players ? (matchWinner === 'a' ? players.a : players.b) : ''
  const winnerScore = matchWinner === 'a' ? scoreA : scoreB
  const loserScore = matchWinner === 'a' ? scoreB : scoreA

  const ui = (
    <div className="fixed inset-0 z-[100] select-none bg-slate-900">
      {phase === 'lobby' && (
        <div className="flex h-dvh flex-col overflow-y-auto bg-gradient-to-b from-rose-50 via-orange-50 to-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <button
              type="button"
              onClick={leave}
              aria-label="Quay lại"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800">{title}</h1>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm active:scale-95"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-4">
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg">
                <Swords size={28} />
              </span>
            </div>
            <p className="mb-5 text-center text-sm text-slate-500">
              Nhập tên + ảnh 2 người. Sai hoặc hết giờ sẽ bị đấm vào ảnh!
            </p>

            <div className="mb-4 rounded-3xl border-2 border-sky-100 bg-white/80 p-4 shadow-sm">
              <span className="mb-3 flex items-center gap-1.5 text-sm font-bold text-sky-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white">
                  1
                </span>
                Người chơi 1 (đầu trên)
              </span>
              <PhotoPicker
                photoUrl={photoA}
                onChange={setPhotoA}
                tone={TONE_A}
                label="Ảnh người chơi 1"
              />
              <input
                type="text"
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                maxLength={16}
                placeholder="Tên — ví dụ: Minh"
                className={`mt-3 w-full rounded-2xl border-2 ${TONE_A.border} bg-white px-4 py-3 text-base font-semibold text-slate-800 outline-none placeholder:text-slate-300 focus:border-sky-400`}
              />
            </div>

            <div className="mb-6 rounded-3xl border-2 border-violet-100 bg-white/80 p-4 shadow-sm">
              <span className="mb-3 flex items-center gap-1.5 text-sm font-bold text-violet-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-[10px] text-white">
                  2
                </span>
                Người chơi 2 (đầu dưới)
              </span>
              <PhotoPicker
                photoUrl={photoB}
                onChange={setPhotoB}
                tone={TONE_B}
                label="Ảnh người chơi 2"
              />
              <input
                type="text"
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                maxLength={16}
                placeholder="Tên — ví dụ: An"
                className={`mt-3 w-full rounded-2xl border-2 ${TONE_B.border} bg-white px-4 py-3 text-base font-semibold text-slate-800 outline-none placeholder:text-slate-300 focus:border-violet-400`}
              />
            </div>

            <button
              type="button"
              onClick={startMatch}
              className="w-full rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 py-4 text-base font-extrabold text-white shadow-lg transition-transform active:scale-[0.98]"
            >
              Bắt đầu đấu!
            </button>
          </div>
        </div>
      )}

      {phase === 'playing' && players && (
        <div className="flex h-dvh flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-hidden" style={{ transform: 'rotate(180deg)' }}>
            <PlayerPanel
              name={players.a}
              photoUrl={photoA}
              punched={punchedA}
              swell={swellA}
              score={scoreA}
              tone={TONE_A}
              round={round}
              qIndex={qIndex}
              timeLeft={timeLeft}
              myPicked={pickedA}
              locked={pickedA !== null}
              resolved={resolved}
              roundWinner={roundWinner}
              myId="a"
              disabled={matchOver}
              onAnswer={(id) => answer('a', id)}
            />
          </div>

          <div className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-y border-white/20 bg-slate-800 px-3 py-1.5 text-white">
            <button
              type="button"
              onClick={leave}
              aria-label="Thoát"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 active:scale-95"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-lg font-black tabular-nums text-sky-300">{scoreA}</span>
              <Swords size={16} className="text-rose-300" />
              <span className="text-lg font-black tabular-nums text-violet-300">{scoreB}</span>
            </div>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 active:scale-95"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <PlayerPanel
              name={players.b}
              photoUrl={photoB}
              punched={punchedB}
              swell={swellB}
              score={scoreB}
              tone={TONE_B}
              round={round}
              qIndex={qIndex}
              timeLeft={timeLeft}
              myPicked={pickedB}
              locked={pickedB !== null}
              resolved={resolved}
              roundWinner={roundWinner}
              myId="b"
              disabled={matchOver}
              onAnswer={(id) => answer('b', id)}
            />
          </div>
        </div>
      )}

      {matchOver && players && matchWinner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="animate-game-pop relative z-0 w-full max-w-xs rounded-[2rem] bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex justify-center">
              <PunchAvatar
                photoUrl={matchWinner === 'a' ? photoA : photoB}
                punched={false}
                swell={matchWinner === 'a' ? swellA : swellB}
                tone={matchWinner === 'a' ? TONE_A : TONE_B}
                size="2xl"
              />
            </div>
            <div
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${
                matchWinner === 'a'
                  ? 'bg-gradient-to-br from-sky-400 to-indigo-500'
                  : 'bg-gradient-to-br from-violet-400 to-fuchsia-500'
              }`}
            >
              <Trophy size={24} className="text-white" strokeWidth={2.2} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">{winnerName} thắng!</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tỉ số {winnerScore} – {loserScore}. Tuyệt vời!
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-2">
                <span className="text-sm font-bold text-sky-600">
                  {players.a}: {scoreA}
                </span>
              </span>
              <Swords size={14} className="text-slate-300" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-2">
                <span className="text-sm font-bold text-violet-600">
                  {players.b}: {scoreB}
                </span>
              </span>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-2">
              <Coins size={18} className="text-yellow-500" />
              <span className="text-base font-bold text-yellow-600">
                +{winnerScore * COINS_PER_ROUND + COINS_MATCH_WIN} xu
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={rematch}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 px-3 py-3 text-sm font-bold text-white shadow-lg active:scale-95"
              >
                <RotateCcw size={18} />
                Đấu lại
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={backToLobby}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-bold text-slate-600 active:scale-95"
                >
                  Đổi tên
                </button>
                <button
                  type="button"
                  onClick={leave}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-bold text-slate-600 active:scale-95"
                >
                  <Home size={18} />
                  Thoát
                </button>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10">
            <Celebration id={getSelectedCelebration()} />
          </div>
        </div>
      )}
    </div>
  )

  return createPortal(ui, document.body)
}
