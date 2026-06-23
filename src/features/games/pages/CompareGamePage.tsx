import { DragDropGame } from '../engine/DragDropGame'
import { generateCompare } from '../engine/rounds'

export default function CompareGamePage() {
  return (
    <DragDropGame
      title="So sánh số"
      subtitle="Kéo dấu <, >, = vào giữa hai số"
      generate={generateCompare}
    />
  )
}
