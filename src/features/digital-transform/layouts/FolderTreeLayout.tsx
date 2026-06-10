import { TabLayout } from '@/shared/components/layout/TabLayout'

import { CDS_FOLDER_TABS } from '../routes/constant'

/** Chuyển đổi số > Cây thư mục CĐS — tab con */
export function FolderTreeLayout() {
  return <TabLayout tabs={CDS_FOLDER_TABS} variant="sub" />
}
