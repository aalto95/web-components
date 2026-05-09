import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@web-components/ui-kit'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
