import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { TemplatePage } from '@/shared/pages/TemplatePage'

import FirstClassPage from './FirstClassPage'

export default function GameListPage() {
  const { t } = useTranslation()
  const { grade } = useParams({ from: '/app/games/$grade' })

  // Lớp 1 có trang danh sách game riêng; các lớp khác tạm dùng placeholder.
  if (grade === '1') return <FirstClassPage />

  return (
    <TemplatePage title={`${t('home.gradeLabel')} ${grade}`} description={t('home.gameListSoon')} />
  )
}
