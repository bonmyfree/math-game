// Metadata, registry và helper lưu lựa chọn hiệu ứng ăn mừng.
// Các component hiệu ứng nằm ở `celebrationEffects.tsx`.

import {
  ConfettiRain,
  EmojiPop,
  FireworkBursts,
  RibbonStreamers,
  SparkleRing,
  StarShower,
} from './celebrationEffects'

import type { ReactNode } from 'react'

export type CelebrationId = 'confetti' | 'burst' | 'stars' | 'emoji' | 'ribbons' | 'rings'

export type CelebrationDef = {
  id: CelebrationId
  name: string
  desc: string
  Component: () => ReactNode
}

export const CELEBRATIONS: CelebrationDef[] = [
  {
    id: 'confetti',
    name: 'Pháo giấy rơi',
    desc: 'Mưa giấy nhiều màu rơi từ trên xuống',
    Component: ConfettiRain,
  },
  {
    id: 'burst',
    name: 'Nổ pháo hoa',
    desc: 'Các chùm pháo nổ tỏa tròn rực rỡ',
    Component: FireworkBursts,
  },
  {
    id: 'stars',
    name: 'Sao lấp lánh',
    desc: 'Những ngôi sao nhấp nháy khắp màn hình',
    Component: StarShower,
  },
  {
    id: 'emoji',
    name: 'Emoji bay lên',
    desc: '🎉🎊✨ nổi lên từ dưới đáy',
    Component: EmojiPop,
  },
  {
    id: 'ribbons',
    name: 'Ruy băng lượn',
    desc: 'Dải ruy băng vừa rơi vừa xoáy lượn',
    Component: RibbonStreamers,
  },
  {
    id: 'rings',
    name: 'Sóng lan + tia sáng',
    desc: 'Vòng sóng lan tỏa kèm tia sáng lấp lánh',
    Component: SparkleRing,
  },
]

const DEFAULT_ID: CelebrationId = 'confetti'
const STORAGE_KEY = 'mathgame.challenge.fx'

export function getSelectedCelebration(): CelebrationId {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && CELEBRATIONS.some((c) => c.id === v)) return v as CelebrationId
  } catch {
    // Bỏ qua nếu không truy cập được localStorage.
  }
  return DEFAULT_ID
}

export function setSelectedCelebration(id: CelebrationId) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Bỏ qua nếu không truy cập được localStorage.
  }
}
