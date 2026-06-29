import { DragDropGame } from '../engine/DragDropGame'
import { generateProgressive, PROGRESSIVE_TOTAL } from '../engine/rounds'

export default function PlayGamePage() {
  return (
    <DragDropGame
      title="Kéo thả đáp án"
      subtitle="Độ khó tăng dần — kéo đáp án đúng vào ô"
      generate={generateProgressive}
      totalRounds={PROGRESSIVE_TOTAL}
    />
  )
}
