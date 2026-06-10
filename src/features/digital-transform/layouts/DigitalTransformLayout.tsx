import { TabLayout } from '@/shared/components/layout/TabLayout'

import { CDS_MAIN_TABS } from '../routes/constant'

/** Chuyển đổi số — tab chính */
export function DigitalTransformLayout() {
  return <TabLayout tabs={CDS_MAIN_TABS} variant="main" />
}
