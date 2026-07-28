import { useParams } from '@tanstack/react-router'

import { TemplatePage } from '@/shared/pages/TemplatePage'

import { FightingGame } from '../engine/FightingGame'
import { GRADE_GAMES } from '../engine/gradeRegistry'

/** Game đối kháng (đua với máy) cho các lớp 2–5. */
export default function GradeFightingPage() {
  const { grade } = useParams({ from: '/app/games/$grade/versus' })
  const games = GRADE_GAMES[grade]

  if (!games) return <TemplatePage title={`Lớp ${grade}`} description="Game đang được cập nhật." />

  return (
    <FightingGame
      title={games.versus.title}
      subtitle={games.versus.subtitle}
      generate={games.versus.generate}
      grade={grade}
    />
  )
}
