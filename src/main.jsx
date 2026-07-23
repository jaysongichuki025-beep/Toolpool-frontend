/**
 * main.jsx — React entry point.
 * WHY: Vite loads this file, which mounts <App /> into #root in index.html.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Datepicker base styles
import 'react-datepicker/dist/react-datepicker.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
