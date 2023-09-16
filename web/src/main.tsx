import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './main.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { Loading } from './components/Loading.tsx'
import { WebSocketProvider } from './context/WebSocketContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </AuthProvider>
    </Suspense>
  </BrowserRouter>,
)
