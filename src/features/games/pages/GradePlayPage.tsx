import { useParams } from '@tanstack/react-router'

import { TemplatePage } from '@/shared/pages/TemplatePage'

import { DragDropGame } from '../engine/DragDropGame'
import { GRADE_GAMES } from '../engine/gradeRegistry'

/** Game kéo–thả tổng hợp cho các lớp 2–5 (nội dung lấy theo `grade`). */
export default function GradePlayPage() {
  const { grade } = useParams({ from: '/app/games/$grade/play' })
  const games = GRADE_GAMES[grade]

  if (!games) return <TemplatePage title={`Lớp ${grade}`} description="Game đang được cập nhật." />

  return (
    <DragDropGame
      title={games.play.title}
      subtitle={games.play.subtitle}
      generate={games.play.generate}
      totalRounds={games.play.totalRounds}
      grade={grade}
    />
  )
}
