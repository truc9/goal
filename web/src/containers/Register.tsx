import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import authService from '../services/authService'

const Register = () => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [register, setRegister] = useState<any>()

	async function handleRegister() {
		try {
			setLoading(true)
			await authService.register({
				email: register.email,
				firstName: register.firstName,
				lastName: register.lastName,
				password: register.password
			})
			setLoading(false)
		} catch (err) {
			setLoading(false)
		}
	}

	function handleChange(e: any) {
		setRegister({
			...register,
			[e.target.name]: e.target.value
		})
	}

	return (
		<div className='flex h-screen w-screen flex-col items-center gap-10 py-60'>
			<h3 className='text-4xl'>Create Account</h3>
			{loading ? (
				<div className='flex w-[500px] flex-col gap-3'>
					<LoadingSkeleton number={5} />
				</div>
			) : (
				<div className='flex w-[500px] flex-col gap-3'>
					<input
						type='text'
						name='email'
						onChange={handleChange}
						placeholder='Email'
					/>
					<input
						type='text'
						name='firstName'
						onChange={handleChange}
						placeholder='First Name'
					/>
					<input
						type='text'
						name='lastName'
						onChange={handleChange}
						placeholder='Last Name'
					/>
					<input
						type='password'
						name='password'
						onChange={handleChange}
						placeholder='Password'
					/>
					<button className='btn-primary' onClick={handleRegister}>
						Register
					</button>
					<button
						className='btn-secondary'
						onClick={() => navigate('/login')}>
						Already have account ?
					</button>
				</div>
			)}
		</div>
	)
}

export default Register
