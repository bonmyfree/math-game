import { useNavigate, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '@/shared/stores'
import { TabItem } from '@/shared/types'
import { cn } from '@/shared/utils'
import { canViewTabRight } from '@/shared/utils/permissionVisibility'

export interface TabBarProps {
  tabs: TabItem[]
  variant?: 'main' | 'sub'
  className?: string
}

export function TabBar({ tabs, variant = 'main', className }: TabBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const permissions = useAuthStore((s) => s.permissions)

  const isActive = (tab: TabItem): boolean =>
    tab.matchPrefix ? location.pathname.startsWith(tab.path) : location.pathname === tab.path

  const visibleTabs = tabs.filter((tab) => canViewTabRight(permissions, tab.right))

  // Derive trực tiếp từ URL — luôn đồng bộ khi:
  //   - User paste URL trực tiếp vào browser
  //   - beforeLoad redirect sang tab khác
  //   - Navigate qua link ngoài TabBar
  const activeTab = visibleTabs.find((t) => isActive(t)) ?? visibleTabs[0]

  return (
    <>
      {variant === 'sub' && activeTab && (
        <span className="font-bold text-lg leading-7 text-gray-900">{t(activeTab.label)}</span>
      )}
      <div
        className={cn(
          'flex border-b text-sm',
          variant === 'main' ? 'border-slate-200 gap-1 pb-2' : 'border-slate-100 gap-0.5',
          className,
        )}
      >
        {visibleTabs.map((tab) => {
          const active = isActive(tab)
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path })}
              className={cn(
                'flex items-center px-4 py-2.5 text-sm font-medium cursor-pointer',
                '-mb-px transition-all whitespace-nowrap',
                variant === 'sub' && 'border-b-2',
                // Active
                active &&
                  variant === 'main' &&
                  'border-slate-900 bg-blue-600 text-white rounded-lg',
                active && variant === 'sub' && 'border-orange-500 text-orange-600 ',

                // Inactive
                !active &&
                  'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              )}
            >
              {t(tab.label)}
            </button>
          )
        })}
      </div>
    </>
  )
}
