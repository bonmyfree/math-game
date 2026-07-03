import { describe, expect, it } from 'vitest'

import * as grade2 from './grade2'
import * as grade3 from './grade3'
import * as grade4 from './grade4'
import * as grade5 from './grade5'
import { distinctNumbers } from './gradeBuilders'

const GRADES = [
  { name: 'Lớp 2', mod: grade2 },
  { name: 'Lớp 3', mod: grade3 },
  { name: 'Lớp 4', mod: grade4 },
  { name: 'Lớp 5', mod: grade5 },
]

const ITER = 300

describe('Đáp án nhiễu cùng hàng đơn vị (độ khó cao)', () => {
  const unitsDigit = (n: number) => Math.abs(n) % 10

  it('sameUnits: giữ nguyên chữ số hàng đơn vị của đáp án cho đủ số nhiễu yêu cầu', () => {
    for (let i = 0; i < 500; i++) {
      const answer = 20 + Math.floor(Math.random() * 9000)
      // MC: 4 đáp án, ép 2 nhiễu cùng hàng đơn vị → ≥ 3 giá trị cùng chữ số cuối.
      const vals = distinctNumbers(answer, 4, 30, 0, 2)
      expect(vals).toContain(answer)
      expect(new Set(vals).size).toBe(4)
      const sameUnit = vals.filter((v) => unitsDigit(v) === unitsDigit(answer))
      expect(sameUnit.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('đáp án nhỏ (< 20) không bị ép cùng hàng đơn vị (giữ dễ)', () => {
    // Với đáp án 1 chữ số, không tạo nhiễu ±10 vô lý; chỉ cần đủ 4 số phân biệt.
    for (let i = 0; i < 200; i++) {
      const answer = 2 + Math.floor(Math.random() * 8) // 2..9
      const vals = distinctNumbers(answer, 4, 3, 0, 2)
      expect(vals).toContain(answer)
      expect(new Set(vals).size).toBe(4)
    }
  })
})

describe('Nội dung game các lớp 2–5', () => {
  for (const { name, mod } of GRADES) {
    describe(name, () => {
      it('game kéo–thả: mỗi câu có đúng đáp án trong danh sách ô, id không trùng', () => {
        for (let i = 0; i < ITER; i++) {
          const level = i % mod.PROGRESSIVE_TOTAL
          const round = mod.generateProgressive(level)
          const ids = round.options.map((o) => o.id)
          expect(ids.length, `level ${level} phải có ≥ 3 ô`).toBeGreaterThanOrEqual(3)
          expect(new Set(ids).size, `level ${level} id không được trùng`).toBe(ids.length)
          expect(ids, `level ${level} phải chứa đáp án ${round.answerId}`).toContain(round.answerId)
        }
      })

      it('game thử thách: mỗi câu có đúng 4 đáp án khác nhau, gồm đáp án đúng', () => {
        for (let i = 0; i < ITER; i++) {
          const round = mod.generateChallenge(i % 21)
          const ids = round.options.map((o) => o.id)
          expect(ids.length, `câu ${i} phải có đúng 4 đáp án`).toBe(4)
          expect(new Set(ids).size, `câu ${i} id không được trùng`).toBe(4)
          expect(ids, `câu ${i} phải chứa đáp án ${round.answerId}`).toContain(round.answerId)
        }
      })
    })
  }
})
