import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { Loading } from './components/Loading.tsx'
import { WebSocketProvider } from './context/WebSocketContext.tsx'
import { ThemeProvider, createTheme } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './main.css'

const theme = createTheme({
	typography: {
		fontFamily: ['-apple-system', 'sans-serif', 'Inter'].join(',')
	}
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<ThemeProvider theme={theme}>
			<WebSocketProvider>
				<AuthProvider>
					<SnackbarProvider>
						<QueryClientProvider client={queryClient}>
							<Suspense fallback={<Loading />}>
								<App />
							</Suspense>
						</QueryClientProvider>
					</SnackbarProvider>
				</AuthProvider>
			</WebSocketProvider>
		</ThemeProvider>
	</BrowserRouter>
)
