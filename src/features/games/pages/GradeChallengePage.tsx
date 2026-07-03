import { useParams } from '@tanstack/react-router'

import { TemplatePage } from '@/shared/pages/TemplatePage'

import { ChallengeGame } from '../engine/ChallengeGame'
import { GRADE_GAMES } from '../engine/gradeRegistry'

/** Game thử thách (trắc nghiệm A/B/C/D) cho các lớp 2–5. */
export default function GradeChallengePage() {
  const { grade } = useParams({ from: '/app/games/$grade/challenge' })
  const games = GRADE_GAMES[grade]

  if (!games) return <TemplatePage title={`Lớp ${grade}`} description="Game đang được cập nhật." />

  return (
    <ChallengeGame
      title={games.challenge.title}
      subtitle={games.challenge.subtitle}
      generate={games.challenge.generate}
      grade={grade}
    />
  )
}
