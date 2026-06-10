import { TabLayout } from '@/shared/components/layout/TabLayout'

import { CDS_PROJECT_TABS } from '../routes/constant'

/** Chuyển đổi số > Quản lý dự án CĐS — tab con */
export function ProjectManagementLayout() {
  return <TabLayout tabs={CDS_PROJECT_TABS} variant="sub" />
}
