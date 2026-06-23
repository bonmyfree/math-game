import { DragDropGame } from '../engine/DragDropGame'
import { generateAddition } from '../engine/rounds'

export default function AdditionGamePage() {
  return (
    <DragDropGame title="Phép cộng" subtitle="Kéo tổng đúng vào ô" generate={generateAddition} />
  )
}
