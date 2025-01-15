import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import axios from 'axios'
import './index.css'
import App from './App.jsx'

axios.defaults.headers.common['User-Email'] = 'admin@admin.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
