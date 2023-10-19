import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonLoading } from '../components/SkeletonLoading'
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
		<div className='tw-flex tw-h-screen tw-w-screen tw-flex-col tw-items-center tw-gap-10 tw-py-60'>
			<h3 className='tw-text-4xl'>Create Account</h3>
			{loading ? (
				<div className='tw-flex tw-w-[500px] tw-flex-col tw-gap-3'>
					<SkeletonLoading number={5} />
				</div>
			) : (
				<div className='tw-flex tw-w-[500px] tw-flex-col tw-gap-3'>
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
