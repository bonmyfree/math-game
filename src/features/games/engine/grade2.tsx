import { bigExpr, dragCompare, dragExpr, mcNumber, numberOptions } from './gradeBuilders'
import { randInt } from './rounds'

import type { ChallengeRound, GameRound, RoundGenerator } from './types'

// ─── Lớp 2 ───────────────────────────────────────────────────────────────────
// Kiến thức trọng tâm: cộng/trừ trong phạm vi 100, bảng nhân & chia 2–5,
// so sánh số trong phạm vi 100, tìm thành phần chưa biết.
//
// Ở các bậc độ khó cao (`hard`), một vài đáp án nhiễu giữ nguyên chữ số hàng
// đơn vị của đáp án đúng → buộc người chơi tính hết cả phép tính.

/** Cộng trong phạm vi `max` (mặc định 100). */
function add(max = 100): { a: number; b: number; sum: number } {
  const a = randInt(11, max - 10)
  const b = randInt(2, max - a)
  return { a, b, sum: a + b }
}

/** Trừ trong phạm vi `max`. */
function sub(max = 100): { a: number; b: number; diff: number } {
  const a = randInt(20, max)
  const b = randInt(2, a - 1)
  return { a, b, diff: a - b }
}

/** Phép nhân trong bảng: thừa số 2..`hi`. */
function mul(hi = 5): { a: number; b: number; p: number } {
  const a = randInt(2, hi)
  const b = randInt(2, 9)
  return { a, b, p: a * b }
}

/** Phép chia hết trong bảng 2..`hi`. */
function div(hi = 5): { dividend: number; divisor: number; q: number } {
  const divisor = randInt(2, hi)
  const q = randInt(2, 9)
  return { dividend: divisor * q, divisor, q }
}

// ─── Game kéo–thả (độ khó tăng dần, 40 câu) ─────────────────────────────────

type DragStage = (hard: boolean) => GameRound

/** Cộng hoặc trừ trong phạm vi 100. */
function dragAddSub(hard = false): GameRound {
  if (Math.random() < 0.5) {
    const { a, b, sum } = add(100)
    return dragExpr(<>Kết quả phép cộng là bao nhiêu?</>, <>{`${a} + ${b} =`}</>, sum, 5, 0, hard)
  }
  const { a, b, diff } = sub(100)
  return dragExpr(<>Kết quả phép trừ là bao nhiêu?</>, <>{`${a} − ${b} =`}</>, diff, 5, 0, hard)
}

/** So sánh hai số trong phạm vi 100. */
function dragCompare2(): GameRound {
  const x = randInt(1, 100)
  const y = randInt(1, 100)
  return dragCompare(x, y, x - y)
}

/** Phép nhân bảng 2–5. */
function dragMul(hard = false): GameRound {
  const { a, b, p } = mul(5)
  return dragExpr(<>Kết quả phép nhân là bao nhiêu?</>, <>{`${a} × ${b} =`}</>, p, 4, 0, hard)
}

/** Trộn nhân/chia và cộng/trừ. */
function dragMixed2(hard = false): GameRound {
  const r = randInt(0, 2)
  if (r === 0) return dragMul(hard)
  if (r === 1) {
    const { dividend, divisor, q } = div(5)
    return dragExpr(
      <>Kết quả phép chia là bao nhiêu?</>,
      <>{`${dividend} ÷ ${divisor} =`}</>,
      q,
      3,
      0,
      hard,
    )
  }
  return dragAddSub(hard)
}

const PROGRESSIVE_STAGES: DragStage[] = [dragAddSub, dragCompare2, dragMul, dragMixed2]

export const PROGRESSIVE_TOTAL = 40
const QUESTIONS_PER_STAGE = 10

export const generateProgressive: RoundGenerator = (level = 0) => {
  const stage = Math.min(Math.floor(level / QUESTIONS_PER_STAGE), PROGRESSIVE_STAGES.length - 1)
  // Hai bậc cuối (nhân, trộn) dùng đáp án nhiễu cùng hàng đơn vị.
  return PROGRESSIVE_STAGES[stage](stage >= 2)
}

// ─── Game thử thách (trắc nghiệm, độ khó tăng theo mỗi 3 câu) ────────────────

type ChallengeStage = (hard: boolean) => ChallengeRound

function cAdd(hard = false): ChallengeRound {
  const { a, b, sum } = add(100)
  return mcNumber(<>{`${a} + ${b} = ?`}</>, sum, 6, 0, hard)
}

function cSub(hard = false): ChallengeRound {
  const { a, b, diff } = sub(100)
  return mcNumber(<>{`${a} − ${b} = ?`}</>, diff, 6, 0, hard)
}

function cMul(hi: number, hard = false): ChallengeRound {
  const { a, b, p } = mul(hi)
  return mcNumber(<>{`${a} × ${b} = ?`}</>, p, 5, 0, hard)
}

function cDiv(hard = false): ChallengeRound {
  const { dividend, divisor, q } = div(5)
  return mcNumber(<>{`${dividend} ÷ ${divisor} = ?`}</>, q, 3, 0, hard)
}

/** Tìm số còn thiếu: ? + b = c hoặc a × ? = c. */
function cMissing(hard = false): ChallengeRound {
  if (Math.random() < 0.5) {
    const { a, b, sum } = add(100)
    return {
      question: bigExpr(<>{`? + ${b} = ${sum}`}</>),
      options: numberOptions(a, 5, 0, 4, hard ? 2 : 0),
      answerId: String(a),
    }
  }
  const { a, b, p } = mul(5)
  return {
    question: bigExpr(<>{`${a} × ? = ${p}`}</>),
    options: numberOptions(b, 3, 1, 4),
    answerId: String(b),
  }
}

const CHALLENGE_STAGES: ChallengeStage[] = [
  cAdd,
  cSub,
  (h) => cMul(3, h),
  (h) => cMul(5, h),
  cDiv,
  cMissing,
  (h) => {
    const gens: ChallengeStage[] = [cAdd, cSub, (x) => cMul(5, x), cDiv, cMissing]
    return gens[randInt(0, gens.length - 1)](h)
  },
]

const CHALLENGE_QUESTIONS_PER_STAGE = 3

export const generateChallenge = (level = 0): ChallengeRound => {
  const stage = Math.min(
    Math.floor(level / CHALLENGE_QUESTIONS_PER_STAGE),
    CHALLENGE_STAGES.length - 1,
  )
  // Nửa sau các bậc (nhân, chia, tìm số thiếu, trộn) tăng độ khó đáp án nhiễu.
  return CHALLENGE_STAGES[stage](stage >= 3)
}
