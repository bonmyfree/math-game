// Âm thanh phản hồi cho game.
// - Đúng (thắng): phát file yeah.mp3 (tiếng reo hò).
// - Sai (thua): hiệu ứng "rung run" tổng hợp bằng Web Audio.
// - Vào game: tiếng chuông gió long lanh tổng hợp bằng Web Audio.

import yeahUrl from '@/assets/sound/yeah.mp3'

type WindowWithAudio = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const w = window as WindowWithAudio
    const Ctor = w.AudioContext ?? w.webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  return ctx
}

/** Phát một tiếng "bíp" với bao hình âm lượng mượt để tránh tiếng "tách". */
function beep(
  c: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = 'sine',
  peak = 0.2,
) {
  const t0 = c.currentTime + startOffset
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.03)
}

// ─── Bật/tắt tiếng (lưu vào localStorage để nhớ giữa các lần chơi) ──────────
const MUTE_KEY = 'mathgame.muted'

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

let muted = readMuted()

export const isMuted = () => muted

export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0')
  } catch {
    // Bỏ qua nếu không truy cập được localStorage.
  }
}

function prepare(): AudioContext | null {
  if (muted) return null
  const c = getCtx()
  if (!c) return null
  // Trình duyệt khóa audio cho tới khi có thao tác người dùng — chơi sau khi
  // kéo thả nên ngữ cảnh sẽ được mở khóa ở đây.
  if (c.state === 'suspended') void c.resume()
  return c
}

// ─── Tiếng "thắng": phát file yeah.mp3 ──────────────────────────────────────
let yeahAudio: HTMLAudioElement | null = null
let yeahFadeTimer: number | null = null

function getYeah(): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null
  if (!yeahAudio) {
    yeahAudio = new Audio(yeahUrl)
    yeahAudio.preload = 'auto'
  }
  return yeahAudio
}

function clearYeahFade() {
  if (yeahFadeTimer !== null) {
    window.clearInterval(yeahFadeTimer)
    yeahFadeTimer = null
  }
}

// ─── Mở khóa audio ở lần tương tác đầu tiên ─────────────────────────────────
// Trình duyệt chặn âm thanh tới khi người dùng chạm/bấm. Ta nghe sự kiện đầu
// tiên (một lần) để resume AudioContext và "mồi" thẻ <audio>.
let audioInitialized = false

function unlockAudio() {
  const c = getCtx()
  if (c && c.state === 'suspended') void c.resume()
  // Mồi thẻ audio trong phạm vi cử chỉ người dùng (cần cho iOS/Safari).
  const a = getYeah()
  if (a) {
    a.muted = true
    a.play()
      .then(() => {
        a.pause()
        a.currentTime = 0
        a.muted = false
      })
      .catch(() => {
        a.muted = false
      })
  }
}

export function initAudio() {
  if (audioInitialized || typeof window === 'undefined') return
  audioInitialized = true
  const handler = () => {
    unlockAudio()
    window.removeEventListener('pointerdown', handler)
    window.removeEventListener('touchstart', handler)
    window.removeEventListener('keydown', handler)
  }
  window.addEventListener('pointerdown', handler)
  window.addEventListener('touchstart', handler)
  window.addEventListener('keydown', handler)
}

/** Khen khi trả lời đúng — phát tiếng reo "yeah". */
export function playCorrect() {
  if (muted) return
  const a = getYeah()
  if (!a) return
  clearYeahFade()
  a.volume = 1
  a.currentTime = 0
  void a.play().catch(() => {})
}

/** Dừng tiếng "yeah" (fade nhẹ) — gọi khi chuyển sang câu tiếp theo. */
export function stopCorrect() {
  const a = yeahAudio
  if (!a || a.paused) return
  clearYeahFade()
  yeahFadeTimer = window.setInterval(() => {
    a.volume = Math.max(0, a.volume - 0.15)
    if (a.volume <= 0.001) {
      a.pause()
      a.currentTime = 0
      a.volume = 1
      clearYeahFade()
    }
  }, 20)
}

/** Báo khi trả lời sai — hiệu ứng "rung run ngộ nghĩnh" (S7). */
export function playWrong() {
  const c = prepare()
  if (!c) return
  const t0 = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(330, t0)
  osc.frequency.exponentialRampToValueAtTime(200, t0 + 0.5)
  lfo.frequency.value = 14 // độ rung
  lfoGain.gain.value = 30
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t0)
  lfo.start(t0)
  osc.stop(t0 + 0.6)
  lfo.stop(t0 + 0.6)
}

function chime(c: AudioContext) {
  ;[784, 880, 1047, 1319, 1568, 1760].forEach((f, i) => beep(c, f, i * 0.08, 0.7, 'sine', 0.22))
}

/** Tiếng khi vào game — "chuông gió long lanh" (T6). */
export function playEnter() {
  if (muted) return
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') {
    // Chưa có tương tác: phát ngay khi audio được mở khóa (resume xong).
    c.resume()
      .then(() => chime(c))
      .catch(() => {})
    return
  }
  chime(c)
}
