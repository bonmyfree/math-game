import { TabLayout } from '@/shared/components/layout/TabLayout'

import { SYS_CATEGORY_TABS } from '../routes/constant'

/** Hệ thống > Danh mục */
export function CategoryLayout() {
  return <TabLayout tabs={SYS_CATEGORY_TABS} variant="sub" />
}
