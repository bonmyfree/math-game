import { useTranslation } from 'react-i18next'

import PageGuard from '@/shared/pages/PageGuard'

import { CDS_RIGHT } from '../../routes/constant'

/** Chuyển đổi số > Cây thư mục CĐS > Cây thư mục chức năng CĐS */
export default function CdsFolderFuncTreePage() {
  const { t } = useTranslation()

  return (
    <PageGuard functionCode={CDS_RIGHT.FOLDER_FUNC_TREE}>
      <div className="m-4" />

      <div className="px-6 py-16 flex justify-center">
        <p className="text-sm text-slate-400">{t('common.pagePlaceholder')}</p>
      </div>
    </PageGuard>
  )
}
