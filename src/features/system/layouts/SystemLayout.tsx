// src/features/system/layouts/SystemLayout.tsx
import { TabLayout } from '@/shared/components/layout/TabLayout'

import { SYSTEM_TABS } from '../routes/constant'

// Hệ thống layout
export function SystemLayout() {
  return <TabLayout tabs={SYSTEM_TABS} variant="main" />
}
