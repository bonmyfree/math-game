import { TabLayout } from '@/shared/components/layout/TabLayout'

import { CDS_FRONT_TABS } from '../routes/constant'

/** Chuyển đổi số > Người dùng Front CĐS — tab con */
export function FrontUserLayout() {
  return <TabLayout tabs={CDS_FRONT_TABS} variant="sub" />
}
