import { useNavigate } from '@tanstack/react-router'
import {
  Settings as SettingsIcon,
  Globe,
  KeyRound,
  LogOut,
  ChevronRight,
  Cog,
  SlidersHorizontal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { authService } from '@/features/auth/services/auth.service'
import { useGlobalStore } from '@/shared/stores'
import { useAuthStore } from '@/shared/stores/auth.store'
import type { Language } from '@/shared/types'
import { cn } from '@/shared/utils'

const LANGUAGES: { code: Language; flag: string; labelKey: string }[] = [
  { code: 'vi', flag: '🇻🇳', labelKey: 'lang.vi' },
  { code: 'en', flag: '🇬🇧', labelKey: 'lang.en' },
]

export default function SettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const locale = useGlobalStore((s) => s.locale)
  const setLocale = useGlobalStore((s) => s.setLocale)

  const initials = user?.userName
    ? user.userName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  const handleLogout = async () => {
    await authService.logout()
  }

  return (
    <div className="relative -m-6 min-h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-b from-slate-100 via-blue-50 to-white p-6 md:min-h-dvh">
      {/* Background chủ đề cài đặt: bánh răng & thanh trượt mờ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Bánh răng lớn xoay chậm */}
        <Cog
          className="absolute -right-10 -top-12 text-slate-300/40 animate-[spin_28s_linear_infinite]"
          size={176}
          strokeWidth={1.2}
        />
        {/* Bánh răng nhỏ xoay ngược */}
        <SettingsIcon
          className="absolute -bottom-8 -left-6 text-blue-300/30 animate-[spin_22s_linear_infinite_reverse]"
          size={128}
          strokeWidth={1.2}
        />
        {/* Thanh trượt */}
        <SlidersHorizontal
          className="absolute bottom-28 right-8 -rotate-6 text-slate-300/40"
          size={72}
          strokeWidth={1.4}
        />
        {/* Chấm tròn điểm xuyết */}
        <span className="absolute left-10 top-16 h-2.5 w-2.5 rounded-full bg-blue-300/50" />
        <span className="absolute right-1/4 top-1/2 h-2 w-2 rounded-full bg-slate-300/60" />
      </div>

      {/* Nội dung */}
      <div className="relative mx-auto w-full max-w-2xl space-y-6">
        {/* Tiêu đề */}
        <div className="flex items-center gap-3">
          <SettingsIcon size={22} className="text-blue-500" />
          <h1 className="text-xl font-bold text-slate-800">{t('nav.settings')}</h1>
        </div>

        {/* Thông tin tài khoản */}
        <button
          type="button"
          onClick={() => navigate({ to: '/account/profile' })}
          className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition-colors hover:bg-slate-50"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white shadow-sm">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">{user?.userName || 'User'}</p>
            <p className="truncate text-sm text-slate-500">{user?.email || user?.role || ''}</p>
          </div>
        </button>

        {/* Ngôn ngữ */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <Globe size={18} className="text-slate-400" />
            <h2 className="text-sm font-semibold">{t('settings.language')}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => {
              const active = locale === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors',
                    active
                      ? 'border-blue-500 bg-blue-50 font-medium text-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{t(lang.labelKey)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Hành động tài khoản */}
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => navigate({ to: '/account/change-password' })}
            className="flex w-full items-center gap-3 px-5 py-4 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <KeyRound size={18} className="shrink-0 text-slate-400" />
            <span className="flex-1 text-left">{t('auth.changePassword')}</span>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 px-5 py-4 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="flex-1 text-left">{t('auth.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
