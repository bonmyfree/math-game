import { useTranslation } from 'react-i18next'

import { TemplatePage } from '@/shared/pages/TemplatePage'

export default function HomeworkPage() {
  const { t } = useTranslation()
  return <TemplatePage title={t('nav.homework')} />
}
