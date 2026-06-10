import { TabLayout } from '@/shared/components/layout/TabLayout'

import { SYS_DEPARTMENT_TABS } from '../routes/constant'

/** Hệ thống > Cấu trúc phòng ban */
export function DepartmentLayout() {
  return <TabLayout tabs={SYS_DEPARTMENT_TABS} variant="sub" />
}
