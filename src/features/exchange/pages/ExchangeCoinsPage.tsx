import { Check, Coins, Lock } from 'lucide-react'

import { useCoinsStore } from '@/shared/stores'

type ShopItem = {
  id: string
  /** Tên vật phẩm */
  name: string
  /** Biểu tượng (emoji) */
  emoji: string
  /** Giá đổi (xu) */
  cost: number
  /** Gradient nền thẻ */
  gradient: string
}

// Danh mục vật phẩm có thể đổi bằng xu.
const ITEMS: ShopItem[] = [
  { id: 'balloon', name: 'Bóng bay', emoji: '🎈', cost: 12, gradient: 'from-rose-400 to-pink-500' },
  { id: 'icecream', name: 'Kem ốc quế', emoji: '🍦', cost: 15, gradient: 'from-amber-400 to-orange-500' }, // prettier-ignore
  {
    id: 'rainbow',
    name: 'Cầu vồng',
    emoji: '🌈',
    cost: 18,
    gradient: 'from-sky-400 to-indigo-500',
  },
  { id: 'cat', name: 'Mèo con', emoji: '🐱', cost: 20, gradient: 'from-orange-400 to-amber-500' },
  { id: 'rocket', name: 'Tên lửa', emoji: '🚀', cost: 25, gradient: 'from-violet-400 to-purple-500' }, // prettier-ignore
  {
    id: 'unicorn',
    name: 'Kỳ lân',
    emoji: '🦄',
    cost: 30,
    gradient: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'trophy',
    name: 'Cúp vàng',
    emoji: '🏆',
    cost: 40,
    gradient: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'crown',
    name: 'Vương miện',
    emoji: '👑',
    cost: 50,
    gradient: 'from-amber-400 to-yellow-500',
  },
]

export default function ExchangeCoinsPage() {
  const coins = useCoinsStore((s) => s.coins)
  const owned = useCoinsStore((s) => s.owned)
  const redeem = useCoinsStore((s) => s.redeem)

  return (
    <div className="relative -m-6 min-h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-b from-amber-50 via-yellow-50 to-white p-6 md:min-h-dvh">
      {/* Trang trí nền mờ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -left-10 -top-12 h-44 w-44 rounded-full bg-amber-200/40" />
        <span className="absolute -right-8 top-24 h-32 w-32 rounded-full bg-yellow-200/40" />
        <span className="absolute bottom-24 left-1/2 h-20 w-20 rounded-full bg-orange-200/40" />
      </div>

      <div className="relative">
        {/* Tiêu đề + số xu đang có */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Đổi xu</h1>
            <p className="text-sm text-slate-500">Chơi game để tích xu và đổi vật phẩm nhé!</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-4 py-2.5 text-white shadow-lg shadow-amber-200/60">
            <Coins size={22} className="text-white" />
            <span className="text-lg font-extrabold">{coins}</span>
          </div>
        </div>

        {/* Lưới vật phẩm */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ITEMS.map((item, i) => {
            const isOwned = owned.includes(item.id)
            const canAfford = coins >= item.cost
            return (
              <div
                key={item.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-game-pop-in flex flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-lg shadow-slate-200/60"
              >
                {/* Hình vật phẩm */}
                <div
                  className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-4xl shadow-inner`}
                >
                  <span aria-hidden>{item.emoji}</span>
                  {isOwned && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-white">
                      <Check size={16} strokeWidth={3} />
                    </span>
                  )}
                </div>

                <span className="text-sm font-bold text-slate-700">{item.name}</span>

                {/* Nút đổi / trạng thái */}
                {isOwned ? (
                  <span className="flex w-full items-center justify-center gap-1 rounded-2xl bg-emerald-50 py-2 text-sm font-bold text-emerald-600">
                    <Check size={16} strokeWidth={3} />
                    Đã sở hữu
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => redeem(item.id, item.cost)}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-2xl py-2 text-sm font-bold transition-all active:scale-95 ${
                      canAfford
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:-translate-y-0.5'
                        : 'cursor-not-allowed bg-slate-100 text-slate-400'
                    }`}
                  >
                    {canAfford ? <Coins size={16} /> : <Lock size={14} />}
                    {item.cost} xu
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
