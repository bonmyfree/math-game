import { useParams } from '@tanstack/react-router'

import ClassGamesPage from './ClassGamesPage'
import FirstClassPage from './FirstClassPage'

export default function GameListPage() {
  const { grade } = useParams({ from: '/app/games/$grade' })

  // Lớp 1 có trang danh sách game riêng; các lớp 2–5 dùng trang chung
  // (ClassGamesPage tự hiển thị placeholder nếu lớp chưa có nội dung).
  if (grade === '1') return <FirstClassPage />

  return <ClassGamesPage />
}
