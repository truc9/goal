import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { Loading } from './components/Loading.tsx'
import { WebSocketProvider } from './context/WebSocketContext.tsx'
import { ThemeProvider, createTheme } from '@mui/material'
import './main.css'

const theme = createTheme({
	typography: {
		fontFamily: ['-apple-system', 'sans-serif', 'Inter'].join(',')
	}
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<ThemeProvider theme={theme}>
			<WebSocketProvider>
				<AuthProvider>
					<Suspense fallback={<Loading />}>
						<App />
					</Suspense>
				</AuthProvider>
			</WebSocketProvider>
		</ThemeProvider>
	</BrowserRouter>
)
