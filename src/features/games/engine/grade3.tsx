import { dragExpr, mcNumber } from './gradeBuilders'
import { randInt } from './rounds'

import type { ChallengeRound, GameRound, RoundGenerator } from './types'

// ─── Lớp 3 ───────────────────────────────────────────────────────────────────
// Kiến thức trọng tâm: cộng/trừ trong phạm vi 1000, bảng nhân & chia đến 9,
// nhân/chia số có 2–3 chữ số với số có 1 chữ số, chu vi hình chữ nhật & vuông.
//
// Ở bậc độ khó cao (`hard`), một vài đáp án nhiễu giữ nguyên chữ số hàng đơn vị
// của đáp án đúng → buộc người chơi tính hết cả phép tính.

function add1000(): { a: number; b: number; sum: number } {
  const sum = randInt(200, 1000)
  const a = randInt(50, sum - 50)
  return { a, b: sum - a, sum }
}

function sub1000(): { a: number; b: number; diff: number } {
  const a = randInt(200, 1000)
  const b = randInt(50, a - 20)
  return { a, b, diff: a - b }
}

/** Nhân bảng đến 9. */
function mul9(): { a: number; b: number; p: number } {
  const a = randInt(2, 9)
  const b = randInt(2, 9)
  return { a, b, p: a * b }
}

/** Chia hết trong bảng đến 9. */
function div9(): { dividend: number; divisor: number; q: number } {
  const divisor = randInt(2, 9)
  const q = randInt(2, 9)
  return { dividend: divisor * q, divisor, q }
}

/** Nhân số có 2 chữ số với số có 1 chữ số. */
function mul2x1(): { a: number; b: number; p: number } {
  const a = randInt(11, 49)
  const b = randInt(2, 5)
  return { a, b, p: a * b }
}

/** Chia hết số có 2–3 chữ số cho số có 1 chữ số. */
function divBig(): { dividend: number; divisor: number; q: number } {
  const divisor = randInt(2, 6)
  const q = randInt(11, 60)
  return { dividend: divisor * q, divisor, q }
}

// ─── Game kéo–thả ────────────────────────────────────────────────────────────

type DragStage = (hard: boolean) => GameRound

function dragAddSub3(hard = false): GameRound {
  if (Math.random() < 0.5) {
    const { a, b, sum } = add1000()
    return dragExpr(<>Kết quả phép cộng là bao nhiêu?</>, <>{`${a} + ${b} =`}</>, sum, 20, 0, hard)
  }
  const { a, b, diff } = sub1000()
  return dragExpr(<>Kết quả phép trừ là bao nhiêu?</>, <>{`${a} − ${b} =`}</>, diff, 20, 0, hard)
}

function dragMul9(hard = false): GameRound {
  const { a, b, p } = mul9()
  return dragExpr(<>Kết quả phép nhân là bao nhiêu?</>, <>{`${a} × ${b} =`}</>, p, 5, 0, hard)
}

function dragDiv9(hard = false): GameRound {
  const { dividend, divisor, q } = div9()
  return dragExpr(
    <>Kết quả phép chia là bao nhiêu?</>,
    <>{`${dividend} ÷ ${divisor} =`}</>,
    q,
    3,
    0,
    hard,
  )
}

function dragMixed3(hard = false): GameRound {
  const r = randInt(0, 2)
  if (r === 0) {
    const { a, b, p } = mul2x1()
    return dragExpr(<>Kết quả phép nhân là bao nhiêu?</>, <>{`${a} × ${b} =`}</>, p, 8, 0, hard)
  }
  if (r === 1) {
    const { dividend, divisor, q } = divBig()
    return dragExpr(
      <>Kết quả phép chia là bao nhiêu?</>,
      <>{`${dividend} ÷ ${divisor} =`}</>,
      q,
      6,
      0,
      hard,
    )
  }
  return dragAddSub3(hard)
}

const PROGRESSIVE_STAGES: DragStage[] = [dragAddSub3, dragMul9, dragDiv9, dragMixed3]

export const PROGRESSIVE_TOTAL = 40
const QUESTIONS_PER_STAGE = 10

export const generateProgressive: RoundGenerator = (level = 0) => {
  const stage = Math.min(Math.floor(level / QUESTIONS_PER_STAGE), PROGRESSIVE_STAGES.length - 1)
  return PROGRESSIVE_STAGES[stage](stage >= 2)
}

// ─── Game thử thách ──────────────────────────────────────────────────────────

type ChallengeStage = (hard: boolean) => ChallengeRound

function cAdd(hard = false): ChallengeRound {
  const { a, b, sum } = add1000()
  return mcNumber(<>{`${a} + ${b} = ?`}</>, sum, 25, 0, hard)
}

function cSub(hard = false): ChallengeRound {
  const { a, b, diff } = sub1000()
  return mcNumber(<>{`${a} − ${b} = ?`}</>, diff, 25, 0, hard)
}

function cMul9(hard = false): ChallengeRound {
  const { a, b, p } = mul9()
  return mcNumber(<>{`${a} × ${b} = ?`}</>, p, 6, 0, hard)
}

function cDiv9(hard = false): ChallengeRound {
  const { dividend, divisor, q } = div9()
  return mcNumber(<>{`${dividend} ÷ ${divisor} = ?`}</>, q, 3, 0, hard)
}

function cMul2x1(hard = false): ChallengeRound {
  const { a, b, p } = mul2x1()
  return mcNumber(<>{`${a} × ${b} = ?`}</>, p, 10, 0, hard)
}

/** Chu vi hình chữ nhật hoặc hình vuông. */
function cPerimeter(hard = false): ChallengeRound {
  if (Math.random() < 0.5) {
    const a = randInt(4, 20)
    const b = randInt(4, 20)
    return mcNumber(
      <>
        Hình chữ nhật dài {a}cm, rộng {b}cm. Chu vi = ? (cm)
      </>,
      2 * (a + b),
      6,
      1,
      hard,
    )
  }
  const s = randInt(4, 25)
  return mcNumber(<>Hình vuông cạnh {s}cm. Chu vi = ? (cm)</>, 4 * s, 6, 1, hard)
}

const CHALLENGE_STAGES: ChallengeStage[] = [
  cAdd,
  cSub,
  cMul9,
  cDiv9,
  cMul2x1,
  cPerimeter,
  (h) => {
    const gens: ChallengeStage[] = [cAdd, cSub, cMul9, cDiv9, cMul2x1, cPerimeter]
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
