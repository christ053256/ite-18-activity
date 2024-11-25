import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Scene from './Scene.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Scene />
  </StrictMode>,
)
