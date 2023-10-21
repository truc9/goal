import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import useLocalAuth from '../hooks/useLocalAuth'

const backgroundImage = 'login-splash.jpg'

const Login = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const auth = useLocalAuth()
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState<{ email?: string; password?: string }>({
		email: '',
		password: ''
	})

	useEffect(() => {
		if (auth.checkIfUserLoggedIn()) {
			const from = location.state?.from?.pathname || '/'
			navigate(from, { replace: true })
		}
	}, [auth, location.state?.from?.pathname, navigate])

	async function handleSignIn() {
		setLoading(true)
		const from = location.state?.from?.pathname || '/'
		if (user) {
			auth.signin(user.email!, user.password!, (error?: string) => {
				if (!error) {
					navigate(from, { replace: true })
				}
			})
		}
	}

	const handleChange = (e: any) => {
		setUser({
			...user,
			[e.target.name]: e.target.value
		})
	}

	return (
		<div className='flex h-screen w-screen'>
			<div className='flex h-full w-1/2'>
				<img
					src={backgroundImage}
					alt='Background'
					className='w-full object-cover'
				/>
			</div>
			<div className='align-items-center flex flex-1 flex-col items-center'>
				<div className='align-items-center flex flex-1 flex-col items-center py-28'>
					<img src='logo-color.svg' alt='Logo' width={250} />
					{loading ? (
						<div className='flex w-[400px] flex-col'>
							<LoadingSkeleton number={4} />
						</div>
					) : (
						<div className='flex w-[400px] flex-col gap-3'>
							<input
								type='text'
								name='email'
								onChange={handleChange}
								placeholder='User Name/Email'
							/>
							<input
								type='password'
								name='password'
								onChange={handleChange}
								placeholder='Password'
							/>
							<button
								className='btn-primary'
								onClick={handleSignIn}>
								Login
							</button>
							<button
								className='btn-secondary'
								onClick={() => navigate('/register')}>
								Create an Account
							</button>
						</div>
					)}
				</div>
				<span className='p-5'>
					Copyright © GOAL {new Date().getFullYear()}
				</span>
			</div>
		</div>
	)
}

export default Login
