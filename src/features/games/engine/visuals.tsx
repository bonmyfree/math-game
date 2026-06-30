import { X } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

/** Một loại đồ vật để đếm: icon (lucide-react) + màu + tên gọi. */
export type CountObject = { icon: LucideIcon; color: string; label: string }

/** Lưới icon đồ vật, tự chọn số cột theo số lượng. */
export function ObjectGrid({
  count,
  obj,
  size = 40,
}: {
  count: number
  obj: CountObject
  size?: number
}) {
  const cols = count <= 4 ? 'grid-cols-2' : count <= 9 ? 'grid-cols-3' : 'grid-cols-4'
  const Icon = obj.icon
  return (
    <div className={`grid place-content-center gap-3 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="animate-game-pop-in"
          style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}
        >
          <Icon className={obj.color} size={size} strokeWidth={2} aria-hidden />
        </span>
      ))}
    </div>
  )
}

/** Hàng icon nằm ngang (dùng cho phép cộng / trừ). `crossed` = số icon bị gạch bỏ. */
export function ObjectRow({
  count,
  obj,
  crossed = 0,
  size = 32,
}: {
  count: number
  obj: CountObject
  crossed?: number
  size?: number
}) {
  const Icon = obj.icon
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="relative animate-game-pop-in"
          style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}
        >
          <Icon
            className={i < crossed ? 'text-slate-300' : obj.color}
            size={size}
            strokeWidth={2}
            aria-hidden
          />
          {i < crossed && (
            <X
              className="absolute inset-0 m-auto text-rose-400"
              size={size}
              strokeWidth={3}
              aria-hidden
            />
          )}
        </span>
      ))}
    </span>
  )
}

/** Dấu phép tính (+, −, =) cỡ lớn. */
export function Op({ children }: { children: string }) {
  return <span className="px-1 text-3xl font-extrabold text-slate-400">{children}</span>
}
