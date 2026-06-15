import { useTranslation } from 'react-i18next'

import { TemplatePage } from '@/shared/pages/TemplatePage'

export default function RanksPage() {
  const { t } = useTranslation()
  return <TemplatePage title={t('nav.ranks')} />
}
