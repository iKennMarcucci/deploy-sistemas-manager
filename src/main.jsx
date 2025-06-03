import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/globals.css'
import { HeroUIProvider } from '@heroui/system'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId = import.meta.env.VITE_CLIENT_ID_GOOGLE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
