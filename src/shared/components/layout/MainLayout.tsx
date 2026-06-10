import { Outlet } from '@tanstack/react-router'

import { useGlobalStore } from '@/shared/stores'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  const collapsed = useGlobalStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useGlobalStore((s) => s.toggleSidebar)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <Header collapsed={collapsed} />
      <main
        className="pt-16 min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
