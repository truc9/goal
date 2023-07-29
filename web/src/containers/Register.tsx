import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"
import { SkeletonLoading } from "../components/SkeletonLoading"

const Register = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [register, setRegister] = useState<any>()

    async function handleRegister() {
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

    function handleChange(e: any) {
        setRegister({
            ...register,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className='tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-py-60 tw-gap-10'>
            <h3 className='tw-text-4xl'>Create An Account</h3>
            {loading ? (
                <div className='tw-w-[500px] tw-flex tw-flex-col tw-gap-3'>
                    <SkeletonLoading number={5} />
                </div>
            ) : (
                <div className='tw-w-[500px] tw-flex tw-flex-col tw-gap-3'>
                    <TextField variant='outlined' name='email' onChange={handleChange} placeholder='User Name/Email' />
                    <TextField variant='outlined' name='firstName' onChange={handleChange} placeholder='First Name' />
                    <TextField variant='outlined' name='lastName' onChange={handleChange} placeholder='Last Name' />
                    <TextField variant='outlined' type='password' name='password' onChange={handleChange} placeholder='Password' />
                    <Button variant='outlined' size='large' onClick={handleRegister}>Register</Button>
                    <Button variant='outlined' size='large' onClick={() => navigate('/login')}>Go back Login</Button>
                </div>
            )}
        </div>
    )
}

export default Register