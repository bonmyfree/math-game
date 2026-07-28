/**
 * Biến dạng ảnh chân dung kiểu “má phồng” bằng bulge trên canvas.
 * Không chỉ tô màu — pixel thật sự bị kéo giãn quanh má / dưới mắt.
 */

export type BulgeSpot = {
  /** Tâm theo tỉ lệ 0–1 trên ảnh vuông (object-cover). */
  cx: number
  cy: number
  /** Bán kính theo tỉ lệ cạnh ảnh. */
  radius: number
  /** Cường độ phồng 0–1. */
  strength: number
}

/** Vẽ ảnh kiểu object-cover vào canvas vuông size×size. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | ImageBitmap,
  size: number,
) {
  const iw = img.width
  const ih = img.height
  const scale = Math.max(size / iw, size / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (size - dw) / 2
  const dy = (size - dh) / 2
  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(img, dx, dy, dw, dh)
}

/**
 * Áp dụng các điểm bulge (inverse mapping).
 * strength > 0 → phóng to / phồng quanh tâm.
 */
function applyBulges(src: ImageData, dst: ImageData, size: number, spots: BulgeSpot[]): void {
  const s = src.data
  const d = dst.data
  const w = size
  const h = size

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sx = x
      let sy = y

      for (const spot of spots) {
        const cx = spot.cx * size
        const cy = spot.cy * size
        const maxR = spot.radius * size
        const dx = sx - cx
        const dy = sy - cy
        const r = Math.sqrt(dx * dx + dy * dy)
        if (r >= maxR || r < 0.0001) continue

        const t = 1 - r / maxR
        // Phồng: lấy mẫu gần tâm hơn → vùng má trông to ra.
        const pull = 1 - spot.strength * t * t
        sx = cx + dx * pull
        sy = cy + dy * pull
      }

      // Bilinear sample
      const x0 = Math.floor(sx)
      const y0 = Math.floor(sy)
      const x1 = Math.min(w - 1, x0 + 1)
      const y1 = Math.min(h - 1, y0 + 1)
      const fx = sx - x0
      const fy = sy - y0

      const clampX0 = Math.max(0, Math.min(w - 1, x0))
      const clampY0 = Math.max(0, Math.min(h - 1, y0))

      const i00 = (clampY0 * w + clampX0) * 4
      const i10 = (clampY0 * w + x1) * 4
      const i01 = (y1 * w + clampX0) * 4
      const i11 = (y1 * w + x1) * 4

      const out = (y * w + x) * 4
      for (let c = 0; c < 4; c++) {
        const v00 = s[i00 + c]
        const v10 = s[i10 + c]
        const v01 = s[i01 + c]
        const v11 = s[i11 + c]
        d[out + c] =
          v00 * (1 - fx) * (1 - fy) + v10 * fx * (1 - fy) + v01 * (1 - fx) * fy + v11 * fx * fy
      }
    }
  }
}

/** Tạo danh sách điểm phồng theo mức sưng 0–5. */
export function swellBulgeSpots(level: number): BulgeSpot[] {
  const L = Math.min(5, Math.max(0, level))
  if (L <= 0) return []

  const t = L / 5
  const leftHeavy = L % 2 === 1
  const main = 0.35 + t * 0.55
  const side = 0.18 + t * 0.35

  const spots: BulgeSpot[] = [
    {
      cx: leftHeavy ? 0.28 : 0.32,
      cy: 0.52,
      radius: 0.32 + t * 0.12,
      strength: leftHeavy ? main : side,
    },
    {
      cx: leftHeavy ? 0.68 : 0.72,
      cy: 0.5,
      radius: 0.32 + t * 0.12,
      strength: leftHeavy ? side : main,
    },
  ]

  // Dưới mắt (thâm / sưng nhẹ)
  if (L >= 2) {
    spots.push({
      cx: leftHeavy ? 0.36 : 0.64,
      cy: 0.38,
      radius: 0.18 + t * 0.08,
      strength: 0.22 + t * 0.3,
    })
  }

  // Cằm / hàm
  if (L >= 3) {
    spots.push({
      cx: 0.5,
      cy: 0.78,
      radius: 0.34,
      strength: 0.2 + t * 0.28,
    })
  }

  // Thái dương
  if (L >= 4) {
    spots.push({
      cx: leftHeavy ? 0.18 : 0.82,
      cy: 0.3,
      radius: 0.2,
      strength: 0.25 + t * 0.25,
    })
  }

  return spots
}

/**
 * Render ảnh đã phồng vào canvas. Trả về false nếu chưa vẽ được (ảnh chưa load).
 */
export function renderSwollenFace(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | ImageBitmap,
  swell: number,
  cssSize: number,
): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const size = Math.max(64, Math.round(cssSize * dpr))
  if (canvas.width !== size || canvas.height !== size) {
    canvas.width = size
    canvas.height = size
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  const spots = swellBulgeSpots(swell)
  drawCover(ctx, img, size)

  if (spots.length === 0) return

  const src = ctx.getImageData(0, 0, size, size)
  const dst = ctx.createImageData(size, size)
  applyBulges(src, dst, size, spots)
  ctx.putImageData(dst, 0, 0)
}
