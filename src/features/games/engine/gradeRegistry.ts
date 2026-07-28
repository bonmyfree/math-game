import * as grade2 from './grade2'
import * as grade3 from './grade3'
import * as grade4 from './grade4'
import * as grade5 from './grade5'

import type { ChallengeGenerator, RoundGenerator } from './types'

/** Cấu hình một thể loại game (kéo–thả hoặc thử thách) của một lớp. */
type PlayConfig = {
  title: string
  subtitle: string
  /** Mô tả ngắn hiển thị trong danh sách thể loại. */
  listDesc: string
  generate: RoundGenerator
  totalRounds: number
}

type ChallengeConfig = {
  title: string
  subtitle: string
  listDesc: string
  generate: ChallengeGenerator
}

/** Đối kháng tái dùng generator trắc nghiệm (cùng dạng câu với thử thách). */
type VersusConfig = {
  title: string
  subtitle: string
  listDesc: string
  generate: ChallengeGenerator
}

export type GradeGames = {
  /** Mô tả trọng tâm kiến thức của lớp (hiển thị dưới tiêu đề). */
  focus: string
  play: PlayConfig
  challenge: ChallengeConfig
  versus: VersusConfig
}

/**
 * Đăng ký nội dung game cho các lớp 2–5. Lớp 1 dùng trang & generator riêng
 * (FirstClassPage + rounds.tsx) nên không nằm ở đây.
 */
export const GRADE_GAMES: Record<string, GradeGames> = {
  '2': {
    focus: 'Cộng trừ trong 100 · Bảng nhân, chia 2–5 · So sánh số',
    play: {
      title: 'Kéo thả đáp án',
      subtitle: 'Độ khó tăng dần — cộng trừ, so sánh, nhân chia',
      listDesc: 'Kéo số đúng vào ô — từ cộng trừ trong 100 đến bảng nhân, chia',
      generate: grade2.generateProgressive,
      totalRounds: grade2.PROGRESSIVE_TOTAL,
    },
    challenge: {
      title: 'Thử thách toán',
      subtitle: '5 mạng · độ khó tăng dần',
      listDesc: 'Chọn đáp án A, B, C, D — cộng trừ, nhân chia, tìm số còn thiếu',
      generate: grade2.generateChallenge,
    },
    versus: {
      title: 'Game đối kháng',
      subtitle: '2 người · chia màn hình · ai đúng trước thắng',
      listDesc: 'Hai người đấu nhau — nhập tên rồi đua chọn đáp án',
      generate: grade2.generateChallenge,
    },
  },
  '3': {
    focus: 'Cộng trừ trong 1000 · Bảng nhân, chia đến 9 · Chu vi',
    play: {
      title: 'Kéo thả đáp án',
      subtitle: 'Độ khó tăng dần — cộng trừ, nhân, chia',
      listDesc: 'Kéo số đúng vào ô — từ cộng trừ trong 1000 đến nhân, chia có nhớ',
      generate: grade3.generateProgressive,
      totalRounds: grade3.PROGRESSIVE_TOTAL,
    },
    challenge: {
      title: 'Thử thách toán',
      subtitle: '5 mạng · độ khó tăng dần',
      listDesc: 'Chọn đáp án A, B, C, D — nhân chia đến 9, nhân số lớn, chu vi',
      generate: grade3.generateChallenge,
    },
    versus: {
      title: 'Game đối kháng',
      subtitle: '2 người · chia màn hình · ai đúng trước thắng',
      listDesc: 'Hai người đấu nhau — nhập tên rồi đua chọn đáp án',
      generate: grade3.generateChallenge,
    },
  },
  '4': {
    focus: 'Số lớn · Phân số · Dấu hiệu chia hết · Trung bình cộng · Diện tích',
    play: {
      title: 'Kéo thả đáp án',
      subtitle: 'Độ khó tăng dần — số lớn, phân số, diện tích',
      listDesc: 'Kéo đáp án đúng vào ô — từ số lớn, so sánh & cộng trừ phân số',
      generate: grade4.generateProgressive,
      totalRounds: grade4.PROGRESSIVE_TOTAL,
    },
    challenge: {
      title: 'Thử thách toán',
      subtitle: '5 mạng · độ khó tăng dần',
      listDesc: 'Chọn đáp án A, B, C, D — dấu hiệu chia hết, phân số, diện tích',
      generate: grade4.generateChallenge,
    },
    versus: {
      title: 'Game đối kháng',
      subtitle: '2 người · chia màn hình · ai đúng trước thắng',
      listDesc: 'Hai người đấu nhau — nhập tên rồi đua chọn đáp án',
      generate: grade4.generateChallenge,
    },
  },
  '5': {
    focus: 'Số thập phân · Tỉ số phần trăm · Diện tích, thể tích · Vận tốc',
    play: {
      title: 'Kéo thả đáp án',
      subtitle: 'Độ khó tăng dần — thập phân, phần trăm, hình học',
      listDesc: 'Kéo đáp án đúng vào ô — từ cộng trừ số thập phân đến phần trăm, hình học',
      generate: grade5.generateProgressive,
      totalRounds: grade5.PROGRESSIVE_TOTAL,
    },
    challenge: {
      title: 'Thử thách toán',
      subtitle: '5 mạng · độ khó tăng dần',
      listDesc: 'Chọn đáp án A, B, C, D — thập phân, phần trăm, diện tích, vận tốc',
      generate: grade5.generateChallenge,
    },
    versus: {
      title: 'Game đối kháng',
      subtitle: '2 người · chia màn hình · ai đúng trước thắng',
      listDesc: 'Hai người đấu nhau — nhập tên rồi đua chọn đáp án',
      generate: grade5.generateChallenge,
    },
  },
}
