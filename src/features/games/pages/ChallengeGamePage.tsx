import { ChallengeGame } from '../engine/ChallengeGame'
import { generateChallenge } from '../engine/rounds'

export default function ChallengeGamePage() {
  return (
    <ChallengeGame
      title="Thử thách toán"
      subtitle="120 giây · 5 mạng · độ khó tăng dần"
      generate={generateChallenge}
    />
  )
}
