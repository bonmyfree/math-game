import { create } from 'zustand'

// Kho xu của bé: tích lũy khi chơi game và dùng để đổi vật phẩm.
// Lưu vào localStorage để giữ lại giữa các lần mở app.
const STORAGE_KEY = 'game.coins'

interface CoinsState {
  /** Số xu đang có. */
  coins: number
  /** Danh sách id vật phẩm đã đổi. */
  owned: string[]
}

interface CoinsActions {
  /** Cộng thêm `n` xu (khi trả lời đúng, hoàn thành game...). */
  addCoins: (n: number) => void
  /** Đổi vật phẩm: trừ xu nếu đủ và chưa sở hữu. Trả về true nếu thành công. */
  redeem: (itemId: string, cost: number) => boolean
  /** Xóa toàn bộ xu và vật phẩm (dùng khi cần reset). */
  reset: () => void
}

function load(): CoinsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CoinsState>
      return { coins: parsed.coins ?? 0, owned: parsed.owned ?? [] }
    }
  } catch {
    // Dữ liệu hỏng — bỏ qua, dùng giá trị mặc định.
  }
  return { coins: 0, owned: [] }
}

function persist(state: CoinsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const useCoinsStore = create<CoinsState & CoinsActions>((set, get) => ({
  ...load(),

  addCoins: (n) =>
    set((s) => {
      const next: CoinsState = { coins: s.coins + n, owned: s.owned }
      persist(next)
      return { coins: next.coins }
    }),

  redeem: (itemId, cost) => {
    const s = get()
    if (s.owned.includes(itemId) || s.coins < cost) return false
    const next: CoinsState = { coins: s.coins - cost, owned: [...s.owned, itemId] }
    persist(next)
    set(next)
    return true
  },

  reset: () => {
    const next: CoinsState = { coins: 0, owned: [] }
    persist(next)
    set(next)
  },
}))
