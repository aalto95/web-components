import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@web-components/ui-kit'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root') as HTMLElement
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
