import { TabLayout } from '@/shared/components/layout/TabLayout'

import { SYS_OPERATION_TABS } from '../routes/constant'
// Vận hành hệ thống layout
export function OperationLayout() {
  return <TabLayout tabs={SYS_OPERATION_TABS} variant="sub" />
}
