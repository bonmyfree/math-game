import { create } from 'zustand'

import i18n from '@/shared/i18n'

type Theme = 'light' | 'dark' | 'system'
type Locale = 'vi' | 'en'

// ─── State Shape ──────────────────────────────────────────────────────────────
interface GlobalState {
  theme: Theme
  locale: Locale
  sidebarCollapsed: boolean
}

// ─── Actions ──────────────────────────────────────────────────────────────────
interface GlobalActions {
  setTheme: (theme: Theme) => void
  setLocale: (locale: Locale) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitialTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) ?? 'system'
}

function getInitialLocale(): Locale {
  return (localStorage.getItem('locale') as Locale) ?? 'vi'
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useGlobalStore = create<GlobalState & GlobalActions>((set) => ({
  theme: getInitialTheme(),
  locale: getInitialLocale(),
  sidebarCollapsed: false,

  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },

  setLocale: (locale) => {
    localStorage.setItem('locale', locale)
    i18n.changeLanguage(locale)
    set({ locale })
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}))
