import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { App } from './app/App'
import { initAudio } from './features/games/engine/sounds'

// Mở khóa âm thanh ở lần người dùng tương tác đầu tiên (chính sách autoplay).
initAudio()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
