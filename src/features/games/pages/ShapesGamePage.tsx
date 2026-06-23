import { DragDropGame } from '../engine/DragDropGame'
import { generateShapes } from '../engine/rounds'

export default function ShapesGamePage() {
  return (
    <DragDropGame title="Hình khối" subtitle="Kéo tên hình đúng vào ô" generate={generateShapes} />
  )
}
