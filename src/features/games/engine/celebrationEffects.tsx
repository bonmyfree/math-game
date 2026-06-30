// Các component hiệu ứng "pháo hoa" ăn mừng (chỉ export component để Fast
// Refresh hoạt động). Metadata, registry và helper lưu lựa chọn nằm ở file
// `celebrations.ts`.

import type { CelebrationId } from './celebrations'
import type { CSSProperties } from 'react'

/** Bảng màu rực rỡ dùng chung cho các hiệu ứng. */
const COLORS = ['#f43f5e', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#facc15']

// ─── 1. Pháo giấy rơi ────────────────────────────────────────────────────────
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  color: COLORS[i % COLORS.length],
  delay: (i % 9) * 0.22,
  duration: 2.2 + (i % 5) * 0.4,
  size: 8 + (i % 3) * 4,
}))

export function ConfettiRain() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="animate-fw-fall absolute rounded-sm"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── 2. Nổ pháo hoa (tỏa tròn) ───────────────────────────────────────────────
const BURST_CLUSTERS = [
  { cx: 24, cy: 32, delay: 0 },
  { cx: 72, cy: 26, delay: 0.5 },
  { cx: 38, cy: 62, delay: 1 },
  { cx: 64, cy: 64, delay: 1.4 },
]
const BURST_PARTICLES = 14

export function FireworkBursts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BURST_CLUSTERS.map((cl, ci) => (
        <span key={ci} className="absolute" style={{ left: `${cl.cx}%`, top: `${cl.cy}%` }}>
          {Array.from({ length: BURST_PARTICLES }).map((_, i) => {
            const angle = (i / BURST_PARTICLES) * Math.PI * 2
            const dist = 52 + (i % 3) * 14
            const style: CSSProperties = {
              background: COLORS[(ci + i) % COLORS.length],
              '--fx': `${Math.cos(angle) * dist}px`,
              '--fy': `${Math.sin(angle) * dist}px`,
              animationDuration: '1.2s',
              animationDelay: `${cl.delay}s`,
            } as CSSProperties
            return (
              <span
                key={i}
                className="animate-fw-burst absolute h-2.5 w-2.5 rounded-full shadow"
                style={style}
              />
            )
          })}
        </span>
      ))}
    </div>
  )
}

// ─── 3. Sao lấp lánh ─────────────────────────────────────────────────────────
const STARS = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 41 + 7) % 96,
  top: (i * 29 + 11) % 88,
  color: COLORS[i % COLORS.length],
  delay: (i % 10) * 0.18,
  duration: 1.1 + (i % 4) * 0.3,
  size: 14 + (i % 4) * 6,
}))

export function StarShower() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="animate-fw-twinkle absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            color: s.color,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <path
            fill="currentColor"
            d="M12 2l2.6 6.3L21 9l-5 4.3L17.5 20 12 16.5 6.5 20 8 13.3 3 9l6.4-.7z"
          />
        </svg>
      ))}
    </div>
  )
}

// ─── 4. Emoji bay lên ────────────────────────────────────────────────────────
const EMOJIS = ['🎉', '🎊', '✨', '⭐', '🏆', '🥳']
const EMOJI_ITEMS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53 + 5) % 94,
  emoji: EMOJIS[i % EMOJIS.length],
  delay: (i % 9) * 0.3,
  duration: 2.4 + (i % 4) * 0.5,
  size: 22 + (i % 3) * 10,
}))

export function EmojiPop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {EMOJI_ITEMS.map((e, i) => (
        <span
          key={i}
          className="animate-fw-rise absolute bottom-0 leading-none"
          style={{
            left: `${e.left}%`,
            fontSize: e.size,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
          }}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  )
}

// ─── 5. Ruy băng lượn ────────────────────────────────────────────────────────
const RIBBONS = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 47 + 3) % 97,
  color: COLORS[i % COLORS.length],
  delay: (i % 8) * 0.28,
  duration: 2.6 + (i % 5) * 0.4,
  height: 16 + (i % 3) * 8,
}))

export function RibbonStreamers() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {RIBBONS.map((r, i) => (
        <span
          key={i}
          className="animate-fw-streamer absolute w-1.5 rounded-full"
          style={{
            left: `${r.left}%`,
            height: r.height,
            background: r.color,
            animationDelay: `${r.delay}s`,
            animationDuration: `${r.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── 6. Sóng lan + tia sáng ──────────────────────────────────────────────────
const RINGS = [
  { cx: 50, cy: 45, delay: 0, color: '#f59e0b' },
  { cx: 30, cy: 60, delay: 0.6, color: '#0ea5e9' },
  { cx: 70, cy: 58, delay: 1.1, color: '#ec4899' },
]
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61 + 9) % 95,
  top: (i * 37 + 13) % 90,
  color: COLORS[i % COLORS.length],
  delay: (i % 8) * 0.2,
  size: 6 + (i % 3) * 3,
}))

export function SparkleRing() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {RINGS.map((r, i) => (
        <span
          key={`r${i}`}
          className="animate-fw-ring absolute h-32 w-32 rounded-full border-4"
          style={{
            left: `${r.cx}%`,
            top: `${r.cy}%`,
            marginLeft: -64,
            marginTop: -64,
            borderColor: r.color,
            animationDelay: `${r.delay}s`,
            animationDuration: '1.6s',
          }}
        />
      ))}
      {SPARKS.map((s, i) => (
        <span
          key={`s${i}`}
          className="animate-fw-twinkle absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            animationDelay: `${s.delay}s`,
            animationDuration: '1.3s',
          }}
        />
      ))}
    </div>
  )
}

/** Vẽ hiệu ứng theo id (mặc định pháo giấy nếu id không khớp). */
export function Celebration({ id }: { id: CelebrationId }) {
  switch (id) {
    case 'burst':
      return <FireworkBursts />
    case 'stars':
      return <StarShower />
    case 'emoji':
      return <EmojiPop />
    case 'ribbons':
      return <RibbonStreamers />
    case 'rings':
      return <SparkleRing />
    case 'confetti':
    default:
      return <ConfettiRain />
  }
}
