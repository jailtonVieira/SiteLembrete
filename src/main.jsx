import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.css'
import { registrarSW } from './hooks/useNotificacoes'

// Registrar Service Worker
registrarSW();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
