// 4 dấu phép tính đặt ở 4 hướng quanh một vòng tròn.
const SYMBOLS = [
  { ch: '+', color: 'from-rose-400 to-pink-500', pos: 'left-1/2 top-0 -translate-x-1/2' },
  { ch: '×', color: 'from-amber-400 to-orange-500', pos: 'right-0 top-1/2 -translate-y-1/2' },
  { ch: '−', color: 'from-emerald-400 to-teal-500', pos: 'bottom-0 left-1/2 -translate-x-1/2' },
  { ch: '÷', color: 'from-sky-400 to-blue-500', pos: 'left-0 top-1/2 -translate-y-1/2' },
]

export function PageLoader() {
  return (
    <div className="flex min-h-[80dvh] w-full items-center justify-center">
      {/* Vòng tròn xoay; mỗi dấu xoay ngược cùng tốc độ để luôn đứng thẳng */}
      <div className="relative h-20 w-20 animate-spin [animation-duration:2.5s]">
        {SYMBOLS.map(({ ch, color, pos }) => (
          <span
            key={ch}
            className={`absolute ${pos} flex h-8 w-8 animate-spin items-center justify-center rounded-xl bg-gradient-to-br ${color} text-lg font-extrabold text-white shadow-md [animation-direction:reverse] [animation-duration:2.5s]`}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  )
}
