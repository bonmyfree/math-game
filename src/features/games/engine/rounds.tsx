import {
  Apple,
  Bird,
  Carrot,
  Cherry,
  Circle,
  Cookie,
  Fish,
  Flower2,
  Gift,
  Heart,
  RectangleHorizontal,
  Square,
  Star,
  Triangle,
} from 'lucide-react'

import { ObjectGrid, ObjectRow, Op } from './visuals'

import type {
  ChallengeGenerator,
  ChallengeRound,
  GameOption,
  GameRound,
  RoundGenerator,
} from './types'
import type { CountObject } from './visuals'
import type { LucideIcon } from 'lucide-react'

// ─── Tiện ích dùng chung ─────────────────────────────────────────────────────
export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Sinh `count` đáp án số gồm đáp án đúng + các số nhiễu gần đó (đã trộn). */
function numberOptions(answer: number, min = 0, max = 10, count = 3): number[] {
  const values = new Set<number>([answer])
  while (values.size < count) {
    const delta = randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1)
    const v = answer + delta
    if (v >= min && v <= max) values.add(v)
  }
  return shuffle([...values])
}

/** Ô số lớn để kéo / hiển thị đáp án. */
const numTile = (n: number) => <span className="text-4xl font-extrabold">{n}</span>

const numberOptionList = (answer: number, min = 0, max = 10): GameOption[] =>
  numberOptions(answer, min, max).map((v) => ({ id: String(v), label: numTile(v) }))

// ─── Bộ đồ vật để đếm (icon trong bộ lucide-react) ──────────────────────────
const OBJECTS: CountObject[] = [
  { icon: Apple, color: 'text-rose-500', label: 'quả táo' },
  { icon: Cherry, color: 'text-pink-500', label: 'quả anh đào' },
  { icon: Star, color: 'text-amber-500', label: 'ngôi sao' },
  { icon: Heart, color: 'text-red-500', label: 'trái tim' },
  { icon: Fish, color: 'text-sky-500', label: 'chú cá' },
  { icon: Flower2, color: 'text-fuchsia-500', label: 'bông hoa' },
  { icon: Cookie, color: 'text-amber-600', label: 'cái bánh' },
  { icon: Gift, color: 'text-violet-500', label: 'món quà' },
  { icon: Bird, color: 'text-teal-500', label: 'chú chim' },
  { icon: Carrot, color: 'text-orange-500', label: 'củ cà rốt' },
]

const pickObject = () => OBJECTS[randInt(0, OBJECTS.length - 1)]

// ─── Các hàm sinh câu hỏi ────────────────────────────────────────────────────

/** Đếm số: đếm số đồ vật rồi kéo số đúng vào ô. `max` = số lớn nhất có thể xuất hiện. */
export function generateCounting(max = 10): GameRound {
  const count = randInt(1, max)
  const obj = pickObject()
  return {
    question: (
      <>
        Có bao nhiêu <span className="text-indigo-600">{obj.label}</span>?
      </>
    ),
    options: numberOptionList(count, 1, max),
    answerId: String(count),
    renderPrompt: (slot) => (
      <div className="flex flex-col items-center gap-4">
        <ObjectGrid count={count} obj={obj} />
        {slot}
      </div>
    ),
  }
}

/** Phép cộng: gộp hai nhóm đồ vật, kéo tổng vào ô. `max` = tổng lớn nhất. */
export function generateAddition(max = 10): GameRound {
  const a = randInt(1, Math.max(1, max - 1))
  const b = randInt(1, Math.max(1, max - a))
  const sum = a + b
  const obj = pickObject()
  return {
    question: <>Có tất cả bao nhiêu?</>,
    options: numberOptionList(sum, 0, max),
    answerId: String(sum),
    renderPrompt: (slot) => (
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <ObjectRow count={a} obj={obj} />
          <Op>+</Op>
          <ObjectRow count={b} obj={obj} />
          <Op>=</Op>
          {slot}
        </div>
        <p className="text-2xl font-bold text-slate-500">
          {a} + {b} = ?
        </p>
      </div>
    ),
  }
}

/** Phép trừ: bớt đi một số đồ vật (gạch bỏ), kéo số còn lại vào ô. `max` = số bị trừ lớn nhất. */
export function generateSubtraction(max = 10): GameRound {
  const a = randInt(2, max)
  const b = randInt(1, a - 1)
  const diff = a - b
  const obj = pickObject()
  return {
    question: <>Còn lại bao nhiêu?</>,
    options: numberOptionList(diff, 0, max),
    answerId: String(diff),
    renderPrompt: (slot) => (
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <ObjectRow count={a} obj={obj} crossed={b} />
          <Op>=</Op>
          {slot}
        </div>
        <p className="text-2xl font-bold text-slate-500">
          {a} − {b} = ?
        </p>
      </div>
    ),
  }
}

/** So sánh số: kéo dấu <, >, = vào giữa hai số. `max` = số lớn nhất có thể xuất hiện. */
export function generateCompare(max = 10): GameRound {
  const x = randInt(1, max)
  const y = randInt(1, max)
  const answerId = x < y ? 'lt' : x > y ? 'gt' : 'eq'
  const sym = (s: string) => <span className="text-5xl font-extrabold">{s}</span>
  return {
    question: <>Chọn dấu thích hợp</>,
    options: shuffle([
      { id: 'lt', label: sym('<') },
      { id: 'gt', label: sym('>') },
      { id: 'eq', label: sym('=') },
    ]),
    answerId,
    renderPrompt: (slot) => (
      <div className="flex items-center justify-center gap-3">
        <span className="text-7xl font-extrabold text-sky-500">{x}</span>
        {slot}
        <span className="text-7xl font-extrabold text-violet-500">{y}</span>
      </div>
    ),
  }
}

// ─── Hình khối ───────────────────────────────────────────────────────────────
type ShapeDef = { id: string; name: string; icon: LucideIcon; color: string }

const SHAPES: ShapeDef[] = [
  { id: 'circle', name: 'Tròn', icon: Circle, color: 'text-rose-500' },
  { id: 'square', name: 'Vuông', icon: Square, color: 'text-amber-500' },
  { id: 'triangle', name: 'Tam giác', icon: Triangle, color: 'text-emerald-500' },
  { id: 'rectangle', name: 'Chữ nhật', icon: RectangleHorizontal, color: 'text-sky-500' },
]

/** Hình khối: nhận diện hình, kéo tên hình đúng vào ô. */
export function generateShapes(): GameRound {
  const target = SHAPES[randInt(0, SHAPES.length - 1)]
  const options = shuffle(SHAPES)
    .filter((s) => s.id !== target.id)
    .slice(0, 2)
    .concat(target)
  const Icon = target.icon
  return {
    question: <>Đây là hình gì?</>,
    options: shuffle(options).map((s) => ({
      id: s.id,
      label: <span className="px-1 text-xl font-bold leading-tight">{s.name}</span>,
    })),
    answerId: target.id,
    renderPrompt: (slot) => (
      <div className="flex flex-col items-center gap-6">
        <Icon
          className={`animate-game-pop ${target.color}`}
          size={120}
          strokeWidth={2}
          aria-hidden
        />
        {slot}
      </div>
    ),
  }
}

/** Đố vui toán: trộn ngẫu nhiên các dạng câu hỏi ở trên. */
export function generateQuiz(): GameRound {
  const gens = [
    generateCounting,
    generateAddition,
    generateSubtraction,
    generateCompare,
    generateShapes,
  ]
  return gens[randInt(0, gens.length - 1)]()
}

/** Số câu hỏi cho mỗi bậc độ khó. Qua mỗi 10 câu đúng sẽ lên bậc tiếp theo. */
const QUESTIONS_PER_STAGE = 10

/** Tổng số câu của game tổng hợp — trả lời đúng đủ số này là chiến thắng. */
export const PROGRESSIVE_TOTAL = 40

/** Chọn ngẫu nhiên một hàm sinh trong danh sách rồi gọi nó. */
const oneOf = (gens: RoundGenerator[]): GameRound => gens[randInt(0, gens.length - 1)]()

/**
 * Các bậc độ khó của game tổng hợp (mỗi bậc 10 câu):
 *   1. Câu 1–10  : Nhận biết số 1–10 và hình
 *   2. Câu 11–20 : So sánh số
 *   3. Câu 21–30 : Cộng / trừ trong phạm vi 10
 *   4. Câu 31–40 : Trộn nâng cao (tất cả chủ đề)
 */
const PROGRESSIVE_STAGES: RoundGenerator[] = [
  () => oneOf([() => generateCounting(10), () => generateShapes()]),
  () => generateCompare(10),
  () => oneOf([() => generateAddition(10), () => generateSubtraction(10)]),
  () =>
    oneOf([
      () => generateCounting(10),
      () => generateShapes(),
      () => generateCompare(10),
      () => generateAddition(10),
      () => generateSubtraction(10),
    ]),
]

/**
 * Game tổng hợp: gộp tất cả chủ đề vào một mạch chơi, độ khó tăng dần theo
 * `level` (số câu bé đã trả lời đúng) — cứ mỗi 10 câu đúng lại lên một bậc.
 */
export function generateProgressive(level = 0): GameRound {
  const stage = Math.min(Math.floor(level / QUESTIONS_PER_STAGE), PROGRESSIVE_STAGES.length - 1)
  return PROGRESSIVE_STAGES[stage]()
}

// ─── Game thử thách (trắc nghiệm A/B/C/D, đếm giờ + mạng) ────────────────────

/** Ô số lớn dùng cho đáp án trắc nghiệm. */
const challengeTile = (n: number) => <span className="text-4xl font-extrabold">{n}</span>

/** Thu nhỏ icon khi số lượng lớn để minh họa không bị tràn thẻ. */
const iconSizeFor = (n: number) => (n > 12 ? 20 : n > 6 ? 26 : 32)

/** Phép tính cỡ lớn hiển thị dưới phần minh họa. */
const challengeExpr = (text: string) => (
  <span className="text-4xl font-extrabold text-slate-700">{text}</span>
)

/** Ô "?" cho dạng tìm số còn thiếu. */
const missingBox = (
  <span className="inline-flex h-12 min-w-12 items-center justify-center rounded-2xl border-4 border-dashed border-indigo-300 px-1 text-3xl font-extrabold text-indigo-400">
    ?
  </span>
)

/**
 * Sinh đúng 4 đáp án số: đáp án đúng + 3 số nhiễu gần đó (đã trộn). Tự nới biên
 * `[min, max]` nếu khoảng quá hẹp để chắc chắn lấy đủ 4 giá trị khác nhau.
 */
function numberOptions4(answer: number, min: number, max: number): GameOption[] {
  let lo = min
  let hi = max
  // Cần ít nhất 4 số nguyên trong khoảng để đủ đáp án.
  while (hi - lo < 3) {
    hi += 1
    if (lo > 0) lo -= 1
  }
  const values = new Set<number>([answer])
  while (values.size < 4) {
    const delta = randInt(1, 5) * (Math.random() < 0.5 ? -1 : 1)
    const v = answer + delta
    if (v >= lo && v <= hi) values.add(v)
  }
  return shuffle([...values]).map((v) => ({ id: String(v), label: challengeTile(v) }))
}

/** Phép cộng trong phạm vi `max` — minh họa hai nhóm đồ vật gộp lại. */
function challengeAdd(max: number): ChallengeRound {
  const a = randInt(1, max - 1)
  const b = randInt(1, max - a)
  const sum = a + b
  const obj = pickObject()
  const size = iconSizeFor(Math.max(a, b))
  return {
    question: (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <ObjectRow count={a} obj={obj} size={size} />
          <Op>+</Op>
          <ObjectRow count={b} obj={obj} size={size} />
        </div>
        {challengeExpr(`${a} + ${b} = ?`)}
      </div>
    ),
    options: numberOptions4(sum, 0, max),
    answerId: String(sum),
  }
}

/** Phép trừ trong phạm vi `max` — minh họa số đồ vật bị gạch bỏ. */
function challengeSub(max: number): ChallengeRound {
  const a = randInt(2, max)
  const b = randInt(1, a - 1)
  const diff = a - b
  const obj = pickObject()
  return {
    question: (
      <div className="flex flex-col items-center gap-4">
        <ObjectRow count={a} obj={obj} crossed={b} size={iconSizeFor(a)} />
        {challengeExpr(`${a} − ${b} = ?`)}
      </div>
    ),
    options: numberOptions4(diff, 0, max),
    answerId: String(diff),
  }
}

/** Tìm số còn thiếu: a + ? = c (trong phạm vi `max`) — minh họa nhóm đã biết và tổng. */
function challengeMissing(max: number): ChallengeRound {
  const a = randInt(1, max - 1)
  const missing = randInt(1, max - a)
  const c = a + missing
  const obj = pickObject()
  const size = iconSizeFor(c)
  return {
    question: (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <ObjectRow count={a} obj={obj} size={size} />
          <Op>+</Op>
          {missingBox}
          <Op>=</Op>
          <ObjectRow count={c} obj={obj} size={size} />
        </div>
        {challengeExpr(`${a} + ? = ${c}`)}
      </div>
    ),
    options: numberOptions4(missing, 0, max),
    answerId: String(missing),
  }
}

const oneOfChallenge = (gens: ChallengeGenerator[]): ChallengeRound =>
  gens[randInt(0, gens.length - 1)]()

/**
 * Game thử thách: độ khó tăng dần sau mỗi 3 câu (`stage = ⌊level / 3⌋`):
 *   0. Cộng trong phạm vi 5
 *   1. Trừ trong phạm vi 5
 *   2. Cộng trong phạm vi 10
 *   3. Trừ trong phạm vi 10
 *   4. Tìm số còn thiếu trong phạm vi 10
 *   5. Cộng / trừ trong phạm vi 20
 *   6+. Trộn nâng cao trong phạm vi 20 (cộng, trừ, tìm số thiếu)
 */
export const CHALLENGE_QUESTIONS_PER_STAGE = 3

const CHALLENGE_STAGES: ChallengeGenerator[] = [
  () => challengeAdd(5),
  () => challengeSub(5),
  () => challengeAdd(10),
  () => challengeSub(10),
  () => challengeMissing(10),
  () => oneOfChallenge([() => challengeAdd(20), () => challengeSub(20)]),
  () =>
    oneOfChallenge([() => challengeAdd(20), () => challengeSub(20), () => challengeMissing(20)]),
]

export function generateChallenge(level = 0): ChallengeRound {
  const stage = Math.min(
    Math.floor(level / CHALLENGE_QUESTIONS_PER_STAGE),
    CHALLENGE_STAGES.length - 1,
  )
  return CHALLENGE_STAGES[stage]()
}
