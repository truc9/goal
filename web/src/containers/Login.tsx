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
		<div className='tw-flex tw-h-screen tw-w-screen'>
			<div className='tw-flex tw-h-full tw-w-1/2'>
				<img
					src={backgroundImage}
					alt='Background'
					className='tw-w-full tw-object-cover'
				/>
			</div>
			<div className='tw-align-items-center tw-flex tw-flex-1 tw-flex-col tw-items-center'>
				<div className='tw-align-items-center tw-flex tw-flex-1 tw-flex-col tw-items-center tw-py-28'>
					<img src='logo-color.svg' alt='Logo' width={250} />
					{loading ? (
						<div className='tw-flex tw-w-[400px] tw-flex-col'>
							<LoadingSkeleton number={4} />
						</div>
					) : (
						<div className='tw-flex tw-w-[400px] tw-flex-col tw-gap-3'>
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
				<span className='tw-p-5'>
					Copyright © GOAL {new Date().getFullYear()}
				</span>
			</div>
		</div>
	)
}

export default Login
