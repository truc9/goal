import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { FiLogIn } from 'react-icons/fi'
import { useLocalAuth } from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'

const Login = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const auth = useLocalAuth()

    const [user, setUser] = useState<{ email?: string, password?: string }>({
        email: 'admin@goal.com',
        password: 'admin'
    })

    async function handleSignIn() {
        const from = location.state?.from?.pathname || "/"
        if (user) {
            auth.signin(user.email!, user.password!, () => {
                navigate(from, { replace: true })
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
        <div className='tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-py-60 tw-gap-10'>
            <h3 className='tw-text-4xl'>Login | Welcome to GOAL</h3>
            <div className='tw-w-[500px] tw-flex tw-flex-col tw-gap-3'>
                <TextField variant='outlined' name='email' value='admin@goal.com' onChange={handleChange} placeholder='User Name/Email' />
                <TextField variant='outlined' type='password' value='admin' name='password' onChange={handleChange} placeholder='Password' />
                <Button variant='contained' size='large' startIcon={<FiLogIn />} onClick={handleSignIn}>Login</Button>
            </div>
        </div>
    )
}

export default Login