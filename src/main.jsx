import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './AppRoutes.jsx'
import { applyTheme, loadStoredTheme } from './theme.js'
import logoImage from './assets/iamges/logo-01.png'

applyTheme(loadStoredTheme())

const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link')
favicon.rel = 'icon'
favicon.type = 'image/png'
favicon.href = logoImage
document.head.appendChild(favicon)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
