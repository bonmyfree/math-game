import { DragDropGame } from '../engine/DragDropGame'
import { generateCounting } from '../engine/rounds'

export default function CountingGamePage() {
  return (
    <DragDropGame
      title="Đếm số"
      subtitle="Kéo số đúng vào nhóm đồ vật"
      generate={generateCounting}
    />
  )
}
