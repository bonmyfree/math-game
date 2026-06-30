import type { ReactNode } from 'react'

/** Một ô để bé kéo. `label` là nội dung hiển thị (số, dấu, hoặc chữ). */
export type GameOption = { id: string; label: ReactNode }

/** Một câu hỏi trong game kéo–thả. */
export type GameRound = {
  /** Câu hỏi hiển thị phía trên thẻ chơi. */
  question: ReactNode
  /** Các ô để bé kéo (thường là 3). */
  options: GameOption[]
  /** id của đáp án đúng (khớp với `GameOption.id`). */
  answerId: string
  /**
   * Vẽ nội dung bên trong thẻ. `slot` là ô đáp án (dấu `?`) do engine cung cấp,
   * generator tự đặt vào vị trí mong muốn (giữa, dưới, ...).
   */
  renderPrompt: (slot: ReactNode) => ReactNode
}

/**
 * Hàm sinh câu hỏi cho một game. `level` là số câu đã trả lời đúng — dùng cho
 * game tăng dần độ khó; các game theo chủ đề cố định có thể bỏ qua tham số này.
 */
export type RoundGenerator = (level?: number) => GameRound

/** Một câu hỏi trắc nghiệm (chạm chọn) — 4 đáp án A, B, C, D. */
export type ChallengeRound = {
  /** Đề bài hiển thị cỡ lớn ở giữa màn hình. */
  question: ReactNode
  /** Đúng 4 lựa chọn, sẽ được gắn nhãn A → D theo thứ tự. */
  options: GameOption[]
  /** id của đáp án đúng (khớp với `GameOption.id`). */
  answerId: string
}

/** Hàm sinh câu hỏi trắc nghiệm theo bậc độ khó (`level` tăng theo số câu đã ra). */
export type ChallengeGenerator = (level?: number) => ChallengeRound
