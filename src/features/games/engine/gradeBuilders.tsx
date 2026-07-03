import { randInt, shuffle } from './rounds'

import type { ChallengeRound, GameOption, GameRound } from './types'
import type { ReactNode } from 'react'

// ─── Bộ dựng câu hỏi dùng chung cho các lớp 2–5 ──────────────────────────────
// Các lớp lớn chủ yếu làm việc với số/biểu thức nên phần lớn câu hỏi là dạng
// "kéo số đúng vào ô" (GameRound) hoặc "chọn 1 trong 4 đáp án" (ChallengeRound).

/** Ô hiển thị một con số, tự thu nhỏ cỡ chữ khi số có nhiều chữ số. */
export function numTile(n: number | string): ReactNode {
  const s = String(n)
  const size =
    s.length >= 6 ? 'text-xl' : s.length >= 5 ? 'text-2xl' : s.length >= 4 ? 'text-3xl' : 'text-4xl'
  return <span className={`${size} font-extrabold`}>{s}</span>
}

/** Ô hiển thị nhãn chữ/ký hiệu (đơn vị, dấu, phân số…). */
export function textTile(label: ReactNode): ReactNode {
  return <span className="px-1 text-2xl font-extrabold leading-tight sm:text-3xl">{label}</span>
}

/** Đề bài cỡ lớn cho game thử thách (biểu thức ở giữa màn hình). */
export function bigExpr(text: ReactNode): ReactNode {
  return (
    <span className="flex flex-wrap items-center justify-center gap-x-2 text-center text-3xl font-extrabold text-slate-700 sm:text-4xl">
      {text}
    </span>
  )
}

/** Ngưỡng tối thiểu để tạo số nhiễu "cùng hàng đơn vị" (cần có hàng chục). */
const SAME_UNITS_MIN = 20

/**
 * Sinh `count` số nguyên phân biệt gồm `answer` + các số nhiễu quanh nó.
 * `spread` = độ lệch tối đa của số nhiễu; `floor` = giá trị nhỏ nhất cho phép.
 *
 * `sameUnits` = số lượng số nhiễu bắt buộc GIỮ NGUYÊN chữ số hàng đơn vị của
 * đáp án (lệch nhau bội số của 10). Dùng ở độ khó cao để người chơi không thể
 * đoán đáp án chỉ bằng chữ số hàng đơn vị mà phải tính hết cả phép tính. Chỉ áp
 * dụng khi đáp án đủ lớn (≥ 20) để còn hàng chục thay đổi.
 */
export function distinctNumbers(
  answer: number,
  count: number,
  spread = 4,
  floor = 0,
  sameUnits = 0,
): number[] {
  const set = new Set<number>([answer])

  // 1) Ưu tiên tạo các số nhiễu cùng chữ số hàng đơn vị (đáp án ± bội số của 10).
  if (sameUnits > 0 && answer >= SAME_UNITS_MIN) {
    const target = 1 + Math.min(sameUnits, count - 1)
    let g = 0
    while (set.size < target && g++ < 100) {
      const v = answer + randInt(1, 3) * 10 * (Math.random() < 0.5 ? -1 : 1)
      if (v >= floor && v !== answer) set.add(v)
    }
  }

  // 2) Bổ sung số nhiễu gần đúng thông thường cho đủ số lượng.
  let guard = 0
  while (set.size < count && guard++ < 300) {
    const delta = randInt(1, spread) * (Math.random() < 0.5 ? -1 : 1)
    const v = answer + delta
    if (v >= floor) set.add(v)
  }

  // 3) Dự phòng: nếu khoảng quá hẹp (đáp án nhỏ) thì thêm số tăng dần cho đủ.
  let extra = Math.max(floor, answer + 1)
  while (set.size < count) {
    if (!set.has(extra)) set.add(extra)
    extra += 1
  }
  return shuffle([...set])
}

/** Danh sách đáp án số cho ô kéo/thả (mặc định 3 ô). */
export function numberOptions(
  answer: number,
  spread = 4,
  floor = 0,
  count = 3,
  sameUnits = 0,
): GameOption[] {
  return distinctNumbers(answer, count, spread, floor, sameUnits).map((v) => ({
    id: String(v),
    label: numTile(v),
  }))
}

/**
 * Câu trắc nghiệm 4 đáp án số. `hard = true` → 2 trong 3 số nhiễu giữ nguyên
 * chữ số hàng đơn vị của đáp án (buộc tính toàn bộ phép tính).
 */
export function mcNumber(
  question: ReactNode,
  answer: number,
  spread = 4,
  floor = 0,
  hard = false,
): ChallengeRound {
  return {
    question: bigExpr(question),
    options: numberOptions(answer, spread, floor, 4, hard ? 2 : 0),
    answerId: String(answer),
  }
}

/**
 * Câu kéo/thả dạng "biểu thức = ?": hiển thị `expr` rồi tới ô đáp án.
 * `answer` là số đúng để bé kéo vào. `hard = true` → 1 số nhiễu giữ nguyên chữ
 * số hàng đơn vị của đáp án.
 */
export function dragExpr(
  question: ReactNode,
  expr: ReactNode,
  answer: number,
  spread = 3,
  floor = 0,
  hard = false,
): GameRound {
  return {
    question,
    options: numberOptions(answer, spread, floor, 3, hard ? 1 : 0),
    answerId: String(answer),
    renderPrompt: (slot) => (
      <div className="flex flex-wrap items-center justify-center gap-2 text-4xl font-extrabold text-slate-600 sm:text-5xl">
        {expr}
        {slot}
      </div>
    ),
  }
}

/** Câu kéo/thả so sánh hai giá trị: kéo dấu <, >, = vào giữa. */
export function dragCompare(left: ReactNode, right: ReactNode, cmp: number): GameRound {
  const answerId = cmp < 0 ? 'lt' : cmp > 0 ? 'gt' : 'eq'
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
        <span className="text-6xl font-extrabold text-sky-500">{left}</span>
        {slot}
        <span className="text-6xl font-extrabold text-violet-500">{right}</span>
      </div>
    ),
  }
}

/** Câu trắc nghiệm với các đáp án là nhãn tuỳ ý (đơn vị, phân số, câu chữ…). */
export function mcLabels(
  question: ReactNode,
  answerId: string,
  options: { id: string; label: ReactNode }[],
): ChallengeRound {
  return {
    question: bigExpr(question),
    options: shuffle(options.map((o) => ({ id: o.id, label: textTile(o.label) }))),
    answerId,
  }
}

/** Phân số hiển thị dạng tử/mẫu xếp dọc. */
export function frac(n: number, d: number): ReactNode {
  return (
    <span className="inline-flex flex-col items-center align-middle leading-none">
      <span className="border-b-2 border-current px-1.5 pb-0.5">{n}</span>
      <span className="px-1.5 pt-0.5">{d}</span>
    </span>
  )
}
