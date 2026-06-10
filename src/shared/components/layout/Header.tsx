import { useNavigate } from '@tanstack/react-router'
import { Globe, User, KeyRound, LogOut, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { authService } from '@/features/auth/services/auth.service'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useGlobalStore } from '@/shared/stores'
import { useAuthStore } from '@/shared/stores/auth.store'
import type { Language } from '@/shared/types'
import { cn } from '@/shared/utils'

const LANGUAGES: { code: Language; flag: string; labelKey: string }[] = [
  { code: 'en', flag: '🇬🇧', labelKey: 'lang.en' },
  { code: 'vi', flag: '🇻🇳', labelKey: 'lang.vi' },
]

interface HeaderProps {
  collapsed: boolean
}

export function Header({ collapsed }: HeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const locale = useGlobalStore((s) => s.locale)
  const setLocale = useGlobalStore((s) => s.setLocale)

  const handleLogout = async () => {
    await authService.logout()
  }

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]
  const initials = user?.userName
    ? user.userName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6 z-20 gap-4 transition-all duration-300 ease-in-out"
      style={{ left: collapsed ? 64 : 240 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors outline-none',
              'data-[state=open]:bg-slate-50',
            )}
          >
            <Globe size={15} />
            <span>
              {currentLang.flag} {t(currentLang.labelKey)}
            </span>
            <ChevronDown
              size={13}
              className="transition-transform group-data-[state=open]:rotate-180"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-44 rounded-xl border border-slate-100 bg-white shadow-lg py-1 z-50"
        >
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={cn(
                'px-4 py-2.5 text-sm cursor-pointer rounded-md mx-1',
                locale === lang.code ? 'text-blue-600 font-medium' : 'text-slate-700',
              )}
              onSelect={() => setLocale(lang.code)}
            >
              <span>{lang.flag}</span>
              <span>{t(lang.labelKey)}</span>
              {locale === lang.code ? (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity outline-none rounded-lg"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-800 leading-tight">
                {user?.userName || user?.role || 'User'}
              </p>
              <p className="text-xs text-slate-500 leading-tight">{user?.role || 'Member'}</p>
            </div>
            <ChevronDown
              size={14}
              className={cn(
                'text-slate-400 transition-transform group-data-[state=open]:rotate-180',
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-52 rounded-xl border border-slate-100 bg-white shadow-lg py-1 z-50"
        >
          <div className="px-4 py-3 border-b border-slate-100 mb-1">
            <p className="text-sm font-semibold text-slate-800">{user?.userName || 'User'}</p>
            <p className="text-xs text-slate-500">{user?.email || ''}</p>
          </div>

          <DropdownMenuItem
            className="gap-3 px-4 py-2.5 text-sm cursor-pointer"
            onSelect={() => navigate({ to: '/account/profile' })}
          >
            <User size={15} className="text-slate-400 shrink-0" />
            {t('auth.accountInfo')}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 px-4 py-2.5 text-sm cursor-pointer"
            onSelect={() => navigate({ to: '/account/change-password' })}
          >
            <KeyRound size={15} className="text-slate-400 shrink-0" />
            {t('auth.changePassword')}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100" />

          <DropdownMenuItem
            variant="destructive"
            className="gap-3 px-4 py-2.5 text-sm cursor-pointer"
            onSelect={() => {
              void handleLogout()
            }}
          >
            <LogOut size={15} className="shrink-0" />
            {t('auth.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
