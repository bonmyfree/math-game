// Âm thanh phản hồi cho game, tạo bằng Web Audio API nên không cần file asset.
// - Đúng: "ting ting" (hai nốt cao, trong trẻo, đi lên).
// - Sai: "tè tè" (hai nốt trầm, đi xuống).

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

/** "Ting ting" — khen khi trả lời đúng. */
export function playCorrect() {
  const c = prepare()
  if (!c) return
  beep(c, 1318.5, 0, 0.12, 'triangle', 0.25) // E6
  beep(c, 1760, 0.11, 0.2, 'triangle', 0.25) // A6
}

/** "Tè tè" — báo khi trả lời sai. */
export function playWrong() {
  const c = prepare()
  if (!c) return
  beep(c, 196, 0, 0.18, 'sawtooth', 0.18) // G3
  beep(c, 146.8, 0.16, 0.28, 'sawtooth', 0.18) // D3
}
