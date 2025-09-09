import './style.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const container = document.querySelector<HTMLDivElement>('#app')!
createRoot(container).render(
  <React.StrictMode>
  <App />
  </React.StrictMode>
)
