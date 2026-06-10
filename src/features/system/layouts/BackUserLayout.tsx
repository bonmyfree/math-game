import { TabLayout } from '@/shared/components/layout/TabLayout'

import { SYS_BACK_USER_TABS } from '../routes/constant'
// Vận hành hệ thống layout
export function BackUserLayout() {
  return <TabLayout tabs={SYS_BACK_USER_TABS} variant="sub" />
}
