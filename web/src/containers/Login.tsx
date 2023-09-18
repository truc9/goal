import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SkeletonLoading } from '../components/SkeletonLoading'
import useLocalAuth from '../hooks/useLocalAuth'
import dayjs from 'dayjs'

const backgroundImage = 'https://images.unsplash.com/photo-1587702068694-a909ef4aa346?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4374&q=80'

const Login = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const auth = useLocalAuth()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<{ email?: string, password?: string }>({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (auth.checkIfUserLoggedIn()) {
            const from = location.state?.from?.pathname || "/"
            navigate(from, { replace: true })
        }
    }, [auth, location.state?.from?.pathname, navigate])

    async function handleSignIn() {
        setLoading(true)
        const from = location.state?.from?.pathname || "/"
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
        <div className='tw-w-screen tw-h-screen tw-flex'>
            <div className='tw-flex tw-h-full tw-w-1/2'>
                <img src={backgroundImage} alt="Background" className='tw-w-full tw-object-cover' />
            </div>
            <div className='tw-flex tw-flex-col tw-flex-1 tw-align-items-center tw-items-center'>
                <div className='tw-flex tw-flex-col tw-flex-1 tw-align-items-center tw-items-center tw-py-28'>
                    <img src="logo-color.svg" alt="Logo" width={250} />
                    {loading ? (
                        <div className='tw-w-[400px] tw-flex tw-flex-col tw-gap-3'>
                            <SkeletonLoading number={4} />
                        </div>
                    ) : (
                        <div className='tw-w-[400px] tw-flex tw-flex-col tw-gap-3'>
                            <TextField variant='outlined' name='email' onChange={handleChange} placeholder='User Name/Email' />
                            <TextField variant='outlined' type='password' name='password' onChange={handleChange} placeholder='Password' />
                            <button className='btn-primary' onClick={handleSignIn}>Login</button>
                            <button className='btn-secondary' onClick={() => navigate('/register')}>Create an Account</button>
                        </div>
                    )}
                </div>
                <span className='tw-p-5'>Copyright © GOAL {dayjs(new Date()).format('DD-MMM-YYYY')}</span>
            </div>
        </div >
    )
}

export default Login