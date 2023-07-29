import React, { Suspense } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiGrid, FiCheckCircle, FiLogOut } from 'react-icons/fi'
import { Loading } from '../components/Loading'
import { useLocalAuth } from '../context/AuthContext'
import { Button } from '@mui/material'

const Layout: React.FC = () => {
    const { user, signout } = useLocalAuth()
    const navigate = useNavigate()

    function handleSignOut() {
        signout(() => {
            navigate('/login', { replace: true })
        })
    }

    return (
        <div className='tw-w-screen tw-h-screen tw-flex bg-slate-50' >
            <nav className='tw-w-16 tw-border-r tw-flex tw-flex-col tw-items-center tw-shadow tw-py-5'>
                <NavLink to='/' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                    <FiGrid size={20} />
                </NavLink>
                <NavLink to='/office-booking' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                    <FiCheckCircle size={20} />
                </NavLink>
            </nav>
            <main className='tw-flex-1'>
                <div className='tw-h-14 tw-flex tw-items-center tw-px-5'>
                    <div className='tw-w-60'>
                        <h3>Hi {user.name}</h3>
                    </div>
                    <div className='tw-flex-1 tw-flex tw-justify-end'>
                        <Button onClick={handleSignOut} startIcon={<FiLogOut />} variant='outlined'>Logout</Button>
                    </div>
                </div>
                <div className='tw-p-5'>
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div >
    )

}


export default Layout