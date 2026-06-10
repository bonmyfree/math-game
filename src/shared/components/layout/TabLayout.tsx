// src/shared/components/layout/TabLayout.tsx

import { Outlet } from '@tanstack/react-router'

import { TabBar, TabBarProps } from '@/shared/components/ui/TabBar'

export function TabLayout({ tabs, variant = 'main' }: TabBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <TabBar tabs={tabs} variant={variant} />
      <Outlet />
    </div>
  )
}
