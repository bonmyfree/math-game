// Âm thanh phản hồi cho game.
// - Đúng (thắng): phát file yeah.mp3 (tiếng reo hò).
// - Sai (thua): hiệu ứng "rung run" tổng hợp bằng Web Audio.
// - Vào game: tiếng chuông gió long lanh tổng hợp bằng Web Audio.
//
// Tất cả âm thanh đi qua MỘT AudioContext duy nhất (kể cả yeah.mp3 được giải mã
// thành AudioBuffer) để chỉ có một đường "mở khóa" autoplay → tránh tình trạng
// lúc có lúc không. Context được resume ở MỌI thao tác chạm/bấm (không chỉ lần
// đầu), nên khi vào game nó đã chạy sẵn và không phải hoãn tiếng "vào game".

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
    void loadYeahBuffer(ctx)
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

/** Lấy context và đảm bảo nó đang chạy (resume nếu bị treo). */
function prepare(): AudioContext | null {
  if (muted) return null
  const c = getCtx()
  if (!c) return null
  if (c.state === 'suspended') void c.resume()
  return c
}

// ─── Tiếng "thắng": yeah.mp3 giải mã thành AudioBuffer ──────────────────────
// Dùng Web Audio (không dùng thẻ <audio>) để: (1) chung một đường mở khóa với
// các tiếng khác, (2) fade/stop được trên iOS (vốn khóa <audio>.volume).
let yeahBuffer: AudioBuffer | null = null
let yeahLoading: Promise<void> | null = null
let yeahSource: AudioBufferSourceNode | null = null
let yeahGain: GainNode | null = null

function loadYeahBuffer(c: AudioContext): Promise<void> {
  if (yeahBuffer) return Promise.resolve()
  if (!yeahLoading) {
    yeahLoading = fetch(yeahUrl)
      .then((r) => r.arrayBuffer())
      .then((buf) => c.decodeAudioData(buf))
      .then((decoded) => {
        yeahBuffer = decoded
      })
      .catch(() => {
        // Giải mã thất bại → để playCorrect dùng phương án dự phòng <audio>.
        yeahLoading = null
      })
  }
  return yeahLoading
}

function stopYeahSource() {
  if (yeahSource) {
    try {
      yeahSource.stop()
    } catch {
      // Đã dừng rồi thì bỏ qua.
    }
    yeahSource.disconnect()
    yeahSource = null
  }
  if (yeahGain) {
    yeahGain.disconnect()
    yeahGain = null
  }
}

// ─── Phương án dự phòng bằng thẻ <audio> nếu Web Audio không khả dụng ────────
let fallbackAudio: HTMLAudioElement | null = null

function getFallbackAudio(): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null
  if (!fallbackAudio) {
    fallbackAudio = new Audio(yeahUrl)
    fallbackAudio.preload = 'auto'
  }
  return fallbackAudio
}

// ─── Mở khóa audio & giữ context luôn chạy ──────────────────────────────────
// Trình duyệt chặn âm thanh tới khi người dùng chạm/bấm, và có thể tự "suspend"
// lại sau một lúc. Vì vậy ta resume context ở MỌI thao tác (không gỡ listener),
// để khi vào game / trả lời đúng, context chắc chắn đang chạy.
let audioInitialized = false
let audioUnlocked = false

function unlockAudio() {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  // QUAN TRỌNG cho iOS: chỉ gọi resume() là CHƯA đủ để có tiếng. iOS chỉ thực
  // sự mở khóa đầu ra audio khi có một buffer được PHÁT bên trong cử chỉ người
  // dùng. Ta phát một buffer câm (1 sample) để "mồi" pipeline. Không làm bước
  // này thì mọi âm thanh bị câm cho tới khi người dùng bấm một nút click nào đó.
  if (!audioUnlocked) {
    try {
      const src = c.createBufferSource()
      src.buffer = c.createBuffer(1, 1, 22050)
      src.connect(c.destination)
      src.start(0)
      audioUnlocked = true
    } catch {
      // Bỏ qua nếu trình duyệt không cho tạo/phát buffer.
    }
  }
  void loadYeahBuffer(c)
}

export function initAudio() {
  if (audioInitialized || typeof window === 'undefined') return
  audioInitialized = true
  const handler = () => unlockAudio()
  // Không gỡ listener: cần resume lại mỗi khi context bị trình duyệt treo.
  // Nghe nhiều loại cử chỉ vì iOS Safari đòi hỏi touchend/click để mở khóa
  // audio (touchstart/pointerdown đơn thuần đôi khi không đủ).
  window.addEventListener('pointerdown', handler, { passive: true })
  window.addEventListener('touchstart', handler, { passive: true })
  window.addEventListener('touchend', handler, { passive: true })
  window.addEventListener('click', handler)
  window.addEventListener('keydown', handler)
  // iOS tự treo AudioContext khi chuyển trang / khóa màn hình. Khi quay lại,
  // resume để lần vào game kế tiếp có tiếng ngay.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && ctx && ctx.state === 'suspended') {
      void ctx.resume()
    }
  })
}

/** Khen khi trả lời đúng — phát tiếng reo "yeah". */
export function playCorrect() {
  const c = prepare()
  if (!c) return
  if (yeahBuffer) {
    stopYeahSource()
    const src = c.createBufferSource()
    const gain = c.createGain()
    src.buffer = yeahBuffer
    gain.gain.setValueAtTime(1, c.currentTime)
    src.connect(gain)
    gain.connect(c.destination)
    src.onended = () => {
      // Chỉ dọn nếu vẫn là source hiện tại (tránh dọn nhầm lần phát mới).
      if (yeahSource === src) stopYeahSource()
    }
    src.start()
    yeahSource = src
    yeahGain = gain
    return
  }
  // Dự phòng: thẻ <audio> (khi chưa giải mã xong hoặc Web Audio không có).
  const a = getFallbackAudio()
  if (!a) return
  a.volume = 1
  a.currentTime = 0
  void a.play().catch(() => {})
  void loadYeahBuffer(c) // thử nạp buffer cho lần sau
}

/** Dừng tiếng "yeah" (fade nhẹ) — gọi khi chuyển sang câu tiếp theo. */
export function stopCorrect() {
  const c = ctx
  if (c && yeahSource && yeahGain) {
    const t0 = c.currentTime
    yeahGain.gain.cancelScheduledValues(t0)
    yeahGain.gain.setValueAtTime(yeahGain.gain.value, t0)
    yeahGain.gain.linearRampToValueAtTime(0.0001, t0 + 0.15)
    const src = yeahSource
    try {
      src.stop(t0 + 0.16)
    } catch {
      // Bỏ qua nếu đã dừng.
    }
    return
  }
  // Dự phòng <audio>: dừng thẳng (iOS không cho chỉnh volume nên không fade).
  const a = fallbackAudio
  if (a && !a.paused) {
    a.pause()
    a.currentTime = 0
  }
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

/**
 * Nhạc chiến thắng khi kết thúc game: một đoạn kèn "fanfare" rải hợp âm đi lên
 * kèm tiếng reo "yeah" để ăn mừng.
 */
export function playWin() {
  const c = prepare()
  if (!c) return // Fanfare: Đô–Mi–Sol–Đô–Mi (rải lên) rồi hợp âm Đô trưởng ngân dài.
  ;[523, 659, 784, 1047, 1319].forEach((f, i) => beep(c, f, i * 0.13, 0.5, 'triangle', 0.2))
  ;[1047, 1319, 1568].forEach((f) => beep(c, f, 0.65, 0.9, 'sine', 0.18))
  // Tiếng reo hò chồng lên trên.
  playCorrect()
}

/** Tiếng khi vào game — "chuông gió long lanh" (T6). */
export function playEnter() {
  const c = prepare()
  if (!c) return
  if (c.state === 'running') {
    chime(c)
    return
  }
  // Context đang treo: thử resume rồi chime, NHƯNG chỉ kêu nếu resume hoàn tất
  // nhanh (trong cửa sổ ngắn). Tránh lỗi cũ: lời hứa resume chỉ xong ở lần chạm
  // kế tiếp — có thể đã rời game → tiếng "vào game" kêu sai chỗ.
  const deadline = performance.now() + 400
  c.resume()
    .then(() => {
      if (performance.now() <= deadline && c.state === 'running') chime(c)
    })
    .catch(() => {})
}
