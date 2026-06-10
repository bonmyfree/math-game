import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  MonitorCog,
  GlobeLock,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NAV_ITEMS } from '@/shared/constants/nav'
import { useAuthStore } from '@/shared/stores'
import { NavIconKey, NavItem } from '@/shared/types'
import { cn } from '@/shared/utils'
import { canViewNavRights } from '@/shared/utils/permissionVisibility'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const permissions = useAuthStore((s) => s.permissions)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    users: true,
  })

  function getImageByKey(key: NavIconKey | undefined) {
    switch (key) {
      case 'dashboard':
        return <LayoutDashboard size={18} />
      case 'system':
        return <MonitorCog size={18} />
      case 'digital-transform':
        return <GlobeLock size={18} />
      default:
        return <LayoutDashboard size={18} />
    }
  }

  const hasRightAccess = (right?: string[]) => canViewNavRights(permissions, right)

  const toggleMenu = (key: string) => {
    if (collapsed) return
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const isActive = (path: string) =>
    path === '/dashboard' ? location.pathname === path : location.pathname.startsWith(path)

  const isParentActive = (children: NavItem[]) => children.some((c) => location.pathname === c.path)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-slate-900 text-white flex flex-col z-30 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo — click để thu gọn / mở rộng sidebar */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
        className={cn(
          'h-16 w-full flex items-center border-b border-slate-700 overflow-hidden cursor-pointer transition-colors hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
          collapsed ? 'justify-center px-2' : 'px-3 text-left',
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 shrink-0 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
            B
          </div>
          <span
            className={cn(
              'font-semibold text-sm tracking-wide whitespace-nowrap transition-all duration-300',
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto',
            )}
          >
            Bolt Holding
          </span>
        </div>
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            if (!hasRightAccess(item.right)) return null
            return (
              <li key={item.key}>
                {item.children ? (
                  <>
                    {/* Parent with children */}
                    <button
                      onClick={() => toggleMenu(item.key)}
                      title={collapsed ? t(item.labelKey) : undefined}
                      className={cn(
                        'w-full flex items-center px-2 py-2.5 rounded-lg text-sm transition-colors',
                        collapsed ? 'justify-center' : 'justify-between',
                        isParentActive(item.children)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                      )}
                    >
                      <span className={cn('flex items-center', collapsed ? '' : 'gap-3')}>
                        <span className="shrink-0">{item.icon}</span>
                        <span
                          className={cn(
                            'whitespace-nowrap transition-all duration-300 overflow-hidden',
                            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-3',
                          )}
                        >
                          {t(item.labelKey)}
                        </span>
                      </span>
                      {!collapsed &&
                        (openMenus[item.key] ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        ))}
                    </button>

                    {/* Children — ẩn khi collapsed */}
                    {!collapsed && openMenus[item.key] && (
                      <ul className="mt-1 ml-4 space-y-1 border-l border-slate-700 pl-3">
                        {item.children.map((child) => (
                          <li key={child.key}>
                            <Link
                              to={child.path}
                              className={cn(
                                'block px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive(child.path)
                                  ? 'bg-blue-500/20 text-blue-300 font-medium'
                                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                              )}
                            >
                              {t(child.labelKey)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  /* Single item */
                  <Link
                    to={item.path!}
                    title={collapsed ? t(item.labelKey) : undefined}
                    className={cn(
                      'flex items-center px-2 py-2.5 rounded-lg text-sm transition-colors',
                      collapsed ? 'justify-center' : 'gap-3',
                      isActive(item.path!)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                    )}
                  >
                    <span className="shrink-0">{getImageByKey(item.icon)}</span>
                    <span
                      className={cn(
                        'whitespace-nowrap transition-all duration-300 overflow-hidden',
                        collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-1',
                      )}
                    >
                      {t(item.labelKey)}
                    </span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Toggle button ở dưới cùng */}
      <div className="border-t border-slate-700 p-2">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? t('nav.expand') : t('nav.collapse')}
        >
          {collapsed ? (
            <ChevronsRight size={18} />
          ) : (
            <span className="flex items-center gap-2 text-sm">
              <ChevronsLeft size={18} />
              <span>{t('nav.collapse')}</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
