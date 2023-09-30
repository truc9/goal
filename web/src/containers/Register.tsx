import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { TextField } from '@mui/material'

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
            navigate('login')
        }
        catch (err) {
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
        <div className='tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-py-60 tw-gap-10'>
            <h3 className='tw-text-4xl'>Create Account</h3>
            {loading ? (
                <div className='tw-w-[500px] tw-flex tw-flex-col tw-gap-3'>
                    <SkeletonLoading number={5} />
                </div>
            ) : (
                <div className='tw-w-[500px] tw-flex tw-flex-col tw-gap-3'>
                    <TextField variant='outlined' name='email' onChange={handleChange} placeholder='Email' />
                    <TextField variant='outlined' name='firstName' onChange={handleChange} placeholder='First Name' />
                    <TextField variant='outlined' name='lastName' onChange={handleChange} placeholder='Last Name' />
                    <TextField variant='outlined' type='password' name='password' onChange={handleChange} placeholder='Password' />
                    <button className='btn-primary' onClick={handleRegister}>Register</button>
                    <button className='btn-secondary' onClick={() => navigate('/login')}>Already have account ?</button>
                </div>
            )}
        </div>
    )
}

export default Register