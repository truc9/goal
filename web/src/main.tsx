import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { Loading } from './components/Loading.tsx'
import { WebSocketProvider } from './context/WebSocketContext.tsx'
import { ThemeProvider, createTheme } from '@mui/material'
import './main.css'
import { SnackbarProvider } from 'notistack'

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
					<SnackbarProvider>
						<Suspense fallback={<Loading />}>
							<App />
						</Suspense>
					</SnackbarProvider>
				</AuthProvider>
			</WebSocketProvider>
		</ThemeProvider>
	</BrowserRouter>
)
