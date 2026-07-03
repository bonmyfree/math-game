import { bigExpr, dragCompare, dragExpr, frac, mcNumber, numTile, textTile } from './gradeBuilders'
import { randInt, shuffle } from './rounds'

import type { ChallengeRound, GameOption, GameRound, RoundGenerator } from './types'

// ─── Lớp 4 ───────────────────────────────────────────────────────────────────
// Kiến thức trọng tâm: bốn phép tính với số tự nhiên lớn, dấu hiệu chia hết,
// phân số (so sánh & cộng/trừ cùng mẫu), số trung bình cộng, diện tích.
//
// Ở bậc độ khó cao (`hard`), một vài đáp án nhiễu của câu tính toán giữ nguyên
// chữ số hàng đơn vị của đáp án → buộc người chơi tính hết cả phép tính.

/** 3 tử số phân biệt gồm `num` + nhiễu, luôn trong khoảng [1, den]. */
function fractionNumerators(num: number, den: number, count = 3): number[] {
  const set = new Set<number>([num])
  let guard = 0
  while (set.size < count && guard++ < 100) {
    const v = num + randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1)
    if (v >= 1 && v <= den) set.add(v)
  }
  let extra = 1
  while (set.size < count) {
    if (extra !== num && extra <= den) set.add(extra)
    extra += 1
  }
  return shuffle([...set])
}

/** Đáp án phân số (cùng mẫu `den`) cho ô kéo/thả hoặc trắc nghiệm. */
function fractionOptions(num: number, den: number, count = 3): GameOption[] {
  return fractionNumerators(num, den, count).map((n) => ({
    id: `${n}/${den}`,
    label: textTile(frac(n, den)),
  }))
}

// ─── Game kéo–thả ────────────────────────────────────────────────────────────

type DragStage = (hard: boolean) => GameRound

/** Cộng/trừ số lớn (4–5 chữ số) hoặc nhân số 2–3 chữ số với 1 chữ số. */
function dragBigCalc(hard = false): GameRound {
  const r = randInt(0, 2)
  if (r === 0) {
    const a = randInt(1000, 50000)
    const b = randInt(1000, 40000)
    return dragExpr(
      <>Kết quả phép cộng là bao nhiêu?</>,
      <>{`${a} + ${b} =`}</>,
      a + b,
      200,
      0,
      hard,
    )
  }
  if (r === 1) {
    const a = randInt(2000, 60000)
    const b = randInt(500, a - 500)
    return dragExpr(
      <>Kết quả phép trừ là bao nhiêu?</>,
      <>{`${a} − ${b} =`}</>,
      a - b,
      200,
      0,
      hard,
    )
  }
  const a = randInt(101, 499)
  const b = randInt(3, 8)
  return dragExpr(<>Kết quả phép nhân là bao nhiêu?</>, <>{`${a} × ${b} =`}</>, a * b, 50, 0, hard)
}

/** So sánh hai phân số cùng mẫu. */
function dragCompareFraction(): GameRound {
  const den = randInt(3, 9)
  const a = randInt(1, den)
  let b = randInt(1, den)
  if (Math.random() < 0.3) b = a // đôi khi bằng nhau
  return dragCompare(frac(a, den), frac(b, den), a - b)
}

/** Cộng/trừ phân số cùng mẫu → kéo phân số kết quả. */
function dragFractionCalc(): GameRound {
  const den = randInt(4, 9)
  const plus = Math.random() < 0.5
  let a: number
  let b: number
  let res: number
  if (plus) {
    a = randInt(1, den - 2)
    b = randInt(1, den - a)
    res = a + b
  } else {
    a = randInt(2, den)
    b = randInt(1, a - 1)
    res = a - b
  }
  return {
    question: <>Kết quả phép tính phân số là bao nhiêu?</>,
    options: fractionOptions(res, den),
    answerId: `${res}/${den}`,
    renderPrompt: (slot) => (
      <div className="flex flex-wrap items-center justify-center gap-3 text-4xl font-extrabold text-slate-600">
        {frac(a, den)}
        <span className="text-slate-400">{plus ? '+' : '−'}</span>
        {frac(b, den)}
        <span className="text-slate-400">=</span>
        {slot}
      </div>
    ),
  }
}

/** Trộn: trung bình cộng / diện tích / tính số lớn. */
function dragMixed4(hard = false): GameRound {
  const r = randInt(0, 2)
  if (r === 0) {
    const x = randInt(10, 99)
    const y = randInt(10, 99)
    const z = randInt(10, 99)
    const sum = x + y + z
    if (sum % 3 === 0) {
      return dragExpr(
        <>
          Trung bình cộng của {x}, {y}, {z} là bao nhiêu?
        </>,
        <>{`(${x}+${y}+${z}) ÷ 3 =`}</>,
        sum / 3,
        5,
        0,
        hard,
      )
    }
  }
  if (r === 1) {
    const a = randInt(5, 25)
    const b = randInt(5, 25)
    return dragExpr(<>Diện tích hình chữ nhật (cm²)?</>, <>{`${a} × ${b} =`}</>, a * b, 30, 0, hard)
  }
  return dragBigCalc(hard)
}

const PROGRESSIVE_STAGES: DragStage[] = [
  dragBigCalc,
  dragCompareFraction,
  dragFractionCalc,
  dragMixed4,
]

export const PROGRESSIVE_TOTAL = 40
const QUESTIONS_PER_STAGE = 10

export const generateProgressive: RoundGenerator = (level = 0) => {
  const stage = Math.min(Math.floor(level / QUESTIONS_PER_STAGE), PROGRESSIVE_STAGES.length - 1)
  return PROGRESSIVE_STAGES[stage](stage >= 2)
}

// ─── Game thử thách ──────────────────────────────────────────────────────────

type ChallengeStage = (hard: boolean) => ChallengeRound

function cBigAddSub(hard = false): ChallengeRound {
  if (Math.random() < 0.5) {
    const a = randInt(1000, 90000)
    const b = randInt(1000, 90000)
    return mcNumber(<>{`${a} + ${b} = ?`}</>, a + b, 500, 0, hard)
  }
  const a = randInt(2000, 90000)
  const b = randInt(500, a - 500)
  return mcNumber(<>{`${a} − ${b} = ?`}</>, a - b, 500, 0, hard)
}

function cMul(hard = false): ChallengeRound {
  const a = randInt(101, 899)
  const b = randInt(3, 9)
  return mcNumber(<>{`${a} × ${b} = ?`}</>, a * b, 80, 0, hard)
}

/** Dấu hiệu chia hết: chọn số chia hết cho k trong 4 số. */
function cDivisible(): ChallengeRound {
  const k = [2, 3, 5, 9][randInt(0, 3)]
  const correct = k * randInt(6, 20)
  const options: GameOption[] = [{ id: String(correct), label: numTile(correct) }]
  const used = new Set<number>([correct])
  let guard = 0
  while (options.length < 4 && guard++ < 200) {
    const v = correct + randInt(1, 9) * (Math.random() < 0.5 ? -1 : 1)
    if (v > 0 && v % k !== 0 && !used.has(v)) {
      used.add(v)
      options.push({ id: String(v), label: numTile(v) })
    }
  }
  return {
    question: bigExpr(<>Số nào chia hết cho {k}?</>),
    options: shuffle(options),
    answerId: String(correct),
  }
}

/** Số trung bình cộng của 2–3 số. */
function cAverage(hard = false): ChallengeRound {
  const count = randInt(2, 3)
  let nums: number[] = []
  let sum = 0
  do {
    nums = Array.from({ length: count }, () => randInt(10, 99))
    sum = nums.reduce((a, b) => a + b, 0)
  } while (sum % count !== 0)
  return mcNumber(<>Trung bình cộng của {nums.join(', ')} = ?</>, sum / count, 6, 1, hard)
}

/** Diện tích hình chữ nhật hoặc hình vuông (cm²). */
function cArea(hard = false): ChallengeRound {
  if (Math.random() < 0.5) {
    const a = randInt(6, 30)
    const b = randInt(6, 30)
    return mcNumber(
      <>
        Hình chữ nhật {a}cm × {b}cm có diện tích ? (cm²)
      </>,
      a * b,
      40,
      1,
      hard,
    )
  }
  const s = randInt(6, 30)
  return mcNumber(<>Hình vuông cạnh {s}cm có diện tích ? (cm²)</>, s * s, 40, 1, hard)
}

/** Cộng hai phân số cùng mẫu (trắc nghiệm). */
function cFractionAdd(): ChallengeRound {
  const den = randInt(4, 9)
  const a = randInt(1, den - 2)
  const b = randInt(1, den - a)
  const res = a + b
  return {
    question: bigExpr(
      <>
        {frac(a, den)} + {frac(b, den)} = ?
      </>,
    ),
    options: shuffle(fractionOptions(res, den, 4)),
    answerId: `${res}/${den}`,
  }
}

const CHALLENGE_STAGES: ChallengeStage[] = [
  cBigAddSub,
  cMul,
  cDivisible,
  cAverage,
  cArea,
  cFractionAdd,
  (h) => {
    const gens: ChallengeStage[] = [cBigAddSub, cMul, cDivisible, cAverage, cArea, cFractionAdd]
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
