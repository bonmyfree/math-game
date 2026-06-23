import { DragDropGame } from '../engine/DragDropGame'
import { generateQuiz } from '../engine/rounds'

export default function QuizGamePage() {
  return (
    <DragDropGame
      title="Đố vui toán"
      subtitle="Trộn nhiều dạng — kéo đáp án đúng"
      generate={generateQuiz}
    />
  )
}
