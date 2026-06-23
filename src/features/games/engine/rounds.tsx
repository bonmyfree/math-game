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

import type { GameOption, GameRound } from './types'
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

/** Đếm số: đếm số đồ vật rồi kéo số đúng vào ô. */
export function generateCounting(): GameRound {
  const count = randInt(1, 10)
  const obj = pickObject()
  return {
    question: (
      <>
        Có bao nhiêu <span className="text-indigo-600">{obj.label}</span>?
      </>
    ),
    options: numberOptionList(count, 1, 10),
    answerId: String(count),
    renderPrompt: (slot) => (
      <div className="flex flex-col items-center gap-4">
        <ObjectGrid count={count} obj={obj} />
        {slot}
      </div>
    ),
  }
}

/** Phép cộng: gộp hai nhóm đồ vật, kéo tổng vào ô. */
export function generateAddition(): GameRound {
  const a = randInt(1, 5)
  const b = randInt(1, Math.min(5, 10 - a))
  const sum = a + b
  const obj = pickObject()
  return {
    question: <>Có tất cả bao nhiêu?</>,
    options: numberOptionList(sum, 0, 10),
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

/** Phép trừ: bớt đi một số đồ vật (gạch bỏ), kéo số còn lại vào ô. */
export function generateSubtraction(): GameRound {
  const a = randInt(2, 10)
  const b = randInt(1, a - 1)
  const diff = a - b
  const obj = pickObject()
  return {
    question: <>Còn lại bao nhiêu?</>,
    options: numberOptionList(diff, 0, 10),
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

/** So sánh số: kéo dấu <, >, = vào giữa hai số. */
export function generateCompare(): GameRound {
  const x = randInt(1, 10)
  const y = randInt(1, 10)
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
