import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './main.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { Loading } from './components/Loading.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
