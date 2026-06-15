import { Outlet } from '@tanstack/react-router'

import { useGlobalStore } from '@/shared/stores'
import { cn } from '@/shared/utils'

import { BottomNavigation } from './BottomNavigation'

export function MainLayout() {
  const collapsed = useGlobalStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen bg-slate-50">
      <BottomNavigation />
      {/* pb-16 chừa chỗ cho thanh điều hướng dưới cùng trên mobile; md:ml-* bám theo bề rộng sidebar */}
      <main
        className={cn(
          'pb-16 md:pb-0 min-h-screen transition-all duration-300 ease-in-out',
          collapsed ? 'md:ml-16' : 'md:ml-60',
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
