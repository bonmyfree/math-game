import { bigExpr, distinctNumbers, dragCompare, mcNumber, numTile } from './gradeBuilders'
import { randInt } from './rounds'

import type { ChallengeRound, GameOption, GameRound, RoundGenerator } from './types'
import type { ReactNode } from 'react'

// ─── Lớp 5 ───────────────────────────────────────────────────────────────────
// Kiến thức trọng tâm: bốn phép tính với số thập phân, tỉ số phần trăm,
// so sánh số thập phân, diện tích tam giác, thể tích hình hộp, vận tốc.
// Số thập phân xử lý ở đơn vị "phần mười" (số nguyên) để tránh sai số dấu phẩy.
//
// Ở bậc độ khó cao (`hard`), một vài đáp án nhiễu giữ nguyên chữ số cuối (hàng
// phần mười với số thập phân) → buộc người chơi tính hết cả phép tính.

/** Định dạng số phần-mười → chuỗi thập phân kiểu Việt Nam (dùng dấu phẩy). */
const fmt = (tenths: number): string => (tenths / 10).toFixed(1).replace('.', ',')

/** Đáp án số thập phân (đơn vị phần-mười) cho ô kéo/thả hoặc trắc nghiệm. */
function decOptions(ansTenths: number, spread: number, count = 3, sameUnits = 0): GameOption[] {
  return distinctNumbers(ansTenths, count, spread, 1, sameUnits).map((t) => ({
    id: String(t),
    label: numTile(fmt(t)),
  }))
}

function dragDecimal(
  question: ReactNode,
  expr: ReactNode,
  ansTenths: number,
  spread: number,
  hard = false,
): GameRound {
  return {
    question,
    options: decOptions(ansTenths, spread, 3, hard ? 1 : 0),
    answerId: String(ansTenths),
    renderPrompt: (slot) => (
      <div className="flex flex-wrap items-center justify-center gap-2 text-4xl font-extrabold text-slate-600 sm:text-5xl">
        {expr}
        {slot}
      </div>
    ),
  }
}

function mcDecimal(
  question: ReactNode,
  ansTenths: number,
  spread: number,
  hard = false,
): ChallengeRound {
  return {
    question: bigExpr(question),
    options: decOptions(ansTenths, spread, 4, hard ? 2 : 0),
    answerId: String(ansTenths),
  }
}

/** Đáp án số nguyên cho các câu kéo/thả phần trăm, diện tích, thể tích. */
function intOptions(answer: number, spread: number, hard = false): GameOption[] {
  return distinctNumbers(answer, 3, spread, 1, hard ? 1 : 0).map((v) => ({
    id: String(v),
    label: numTile(v),
  }))
}

// ─── Sinh cặp số thập phân (đơn vị phần-mười) ────────────────────────────────
function decAdd(): { a: number; b: number; sum: number } {
  const a = randInt(11, 199)
  const b = randInt(11, 199)
  return { a, b, sum: a + b }
}

function decSub(): { a: number; b: number; diff: number } {
  const a = randInt(30, 200)
  const b = randInt(11, a - 5)
  return { a, b, diff: a - b }
}

// ─── Game kéo–thả ────────────────────────────────────────────────────────────

type DragStage = (hard: boolean) => GameRound

function dragDecAddSub(hard = false): GameRound {
  if (Math.random() < 0.5) {
    const { a, b, sum } = decAdd()
    return dragDecimal(
      <>Kết quả phép cộng là bao nhiêu?</>,
      <>{`${fmt(a)} + ${fmt(b)} =`}</>,
      sum,
      8,
      hard,
    )
  }
  const { a, b, diff } = decSub()
  return dragDecimal(
    <>Kết quả phép trừ là bao nhiêu?</>,
    <>{`${fmt(a)} − ${fmt(b)} =`}</>,
    diff,
    8,
    hard,
  )
}

function dragDecCompare(): GameRound {
  const a = randInt(1, 200)
  let b = randInt(1, 200)
  if (Math.random() < 0.25) b = a
  return dragCompare(fmt(a), fmt(b), a - b)
}

function dragDecMulDiv(hard = false): GameRound {
  if (Math.random() < 0.5) {
    const a = randInt(11, 60) // 1.1 .. 6.0
    const k = randInt(2, 5)
    return dragDecimal(
      <>Kết quả phép nhân là bao nhiêu?</>,
      <>{`${fmt(a)} × ${k} =`}</>,
      a * k,
      10,
      hard,
    )
  }
  const ans = randInt(11, 60)
  const k = randInt(2, 5)
  const dividend = ans * k
  return dragDecimal(
    <>Kết quả phép chia là bao nhiêu?</>,
    <>{`${fmt(dividend)} ÷ ${k} =`}</>,
    ans,
    8,
    hard,
  )
}

/** Trộn: phần trăm / diện tích tam giác / thể tích (đáp án là số nguyên). */
function dragMixed5(hard = false): GameRound {
  const r = randInt(0, 2)
  if (r === 0) {
    const p = [10, 20, 25, 50, 5][randInt(0, 4)]
    const res = randInt(2, 20)
    const base = (res * 100) / p
    return {
      question: <>Tính giá trị phần trăm</>,
      options: intOptions(res, 5, hard),
      answerId: String(res),
      renderPrompt: (slot) => (
        <div className="flex flex-wrap items-center justify-center gap-2 text-4xl font-extrabold text-slate-600 sm:text-5xl">
          {`${p}% của ${base} =`}
          {slot}
        </div>
      ),
    }
  }
  if (r === 1) {
    const a = randInt(4, 20)
    let h = randInt(3, 18)
    if ((a * h) % 2 !== 0) h += 1
    const area = (a * h) / 2
    return {
      question: <>Diện tích tam giác (cm²)?</>,
      options: intOptions(area, 8, hard),
      answerId: String(area),
      renderPrompt: (slot) => (
        <div className="flex flex-wrap items-center justify-center gap-2 text-3xl font-extrabold text-slate-600 sm:text-4xl">
          {`(${a} × ${h}) ÷ 2 =`}
          {slot}
        </div>
      ),
    }
  }
  const a = randInt(2, 8)
  const b = randInt(2, 8)
  const c = randInt(2, 8)
  return {
    question: <>Thể tích hình hộp chữ nhật (cm³)?</>,
    options: intOptions(a * b * c, 15, hard),
    answerId: String(a * b * c),
    renderPrompt: (slot) => (
      <div className="flex flex-wrap items-center justify-center gap-2 text-3xl font-extrabold text-slate-600 sm:text-4xl">
        {`${a} × ${b} × ${c} =`}
        {slot}
      </div>
    ),
  }
}

const PROGRESSIVE_STAGES: DragStage[] = [dragDecAddSub, dragDecCompare, dragDecMulDiv, dragMixed5]

export const PROGRESSIVE_TOTAL = 40
const QUESTIONS_PER_STAGE = 10

export const generateProgressive: RoundGenerator = (level = 0) => {
  const stage = Math.min(Math.floor(level / QUESTIONS_PER_STAGE), PROGRESSIVE_STAGES.length - 1)
  return PROGRESSIVE_STAGES[stage](stage >= 2)
}

// ─── Game thử thách ──────────────────────────────────────────────────────────

type ChallengeStage = (hard: boolean) => ChallengeRound

function cDecAdd(hard = false): ChallengeRound {
  const { a, b, sum } = decAdd()
  return mcDecimal(<>{`${fmt(a)} + ${fmt(b)} = ?`}</>, sum, 10, hard)
}

function cDecSub(hard = false): ChallengeRound {
  const { a, b, diff } = decSub()
  return mcDecimal(<>{`${fmt(a)} − ${fmt(b)} = ?`}</>, diff, 10, hard)
}

function cDecMul(hard = false): ChallengeRound {
  const a = randInt(11, 90)
  const k = randInt(2, 6)
  return mcDecimal(<>{`${fmt(a)} × ${k} = ?`}</>, a * k, 12, hard)
}

/** Tỉ số phần trăm: p% của base (kết quả nguyên). */
function cPercent(hard = false): ChallengeRound {
  const p = [10, 20, 25, 50, 5][randInt(0, 4)]
  const res = randInt(2, 30)
  const base = (res * 100) / p
  return mcNumber(<>{`${p}% của ${base} = ?`}</>, res, 6, 1, hard)
}

/** Diện tích tam giác (đáy × cao ÷ 2). */
function cTriangle(hard = false): ChallengeRound {
  const a = randInt(4, 24)
  let h = randInt(3, 20)
  if ((a * h) % 2 !== 0) h += 1
  return mcNumber(
    <>
      Tam giác đáy {a}cm, cao {h}cm có diện tích ? (cm²)
    </>,
    (a * h) / 2,
    10,
    1,
    hard,
  )
}

/** Vận tốc = quãng đường ÷ thời gian (km/giờ). */
function cSpeed(hard = false): ChallengeRound {
  const v = randInt(20, 70)
  const t = randInt(2, 5)
  return mcNumber(
    <>
      Ô tô đi {v * t}km trong {t} giờ. Vận tốc = ? (km/giờ)
    </>,
    v,
    8,
    1,
    hard,
  )
}

/** Thể tích hình hộp chữ nhật (cm³). */
function cVolume(hard = false): ChallengeRound {
  const a = randInt(2, 10)
  const b = randInt(2, 10)
  const c = randInt(2, 10)
  return mcNumber(
    <>
      Hình hộp {a}cm × {b}cm × {c}cm có thể tích ? (cm³)
    </>,
    a * b * c,
    20,
    1,
    hard,
  )
}

const CHALLENGE_STAGES: ChallengeStage[] = [
  cDecAdd,
  cDecSub,
  cDecMul,
  cPercent,
  cTriangle,
  (h) => (Math.random() < 0.5 ? cSpeed(h) : cVolume(h)),
  (h) => {
    const gens: ChallengeStage[] = [cDecAdd, cDecSub, cDecMul, cPercent, cTriangle, cSpeed, cVolume]
    return gens[randInt(0, gens.length - 1)](h)
  },
]

const CHALLENGE_QUESTIONS_PER_STAGE = 3

export const generateChallenge = (level = 0): ChallengeRound => {
  const stage = Math.min(
    Math.floor(level / CHALLENGE_QUESTIONS_PER_STAGE),
    CHALLENGE_STAGES.length - 1,
  )
  return CHALLENGE_STAGES[stage](stage >= 3)
}
