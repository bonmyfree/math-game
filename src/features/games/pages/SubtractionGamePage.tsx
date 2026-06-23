import { DragDropGame } from '../engine/DragDropGame'
import { generateSubtraction } from '../engine/rounds'

export default function SubtractionGamePage() {
  return (
    <DragDropGame title="Phép trừ" subtitle="Kéo số còn lại vào ô" generate={generateSubtraction} />
  )
}
