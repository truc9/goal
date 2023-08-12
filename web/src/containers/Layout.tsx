import React, { Suspense } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiGrid, FiCheckCircle, FiLogOut, FiCalendar, FiBarChart2 } from 'react-icons/fi'
import { Loading } from '../components/Loading'
import { useLocalAuth } from '../context/AuthContext'
import { IconButton } from '@mui/material'

const Layout: React.FC = () => {
    const { user, signout } = useLocalAuth()
    const navigate = useNavigate()

    function handleSignOut() {
        signout(() => {
            navigate('/login', { replace: true })
        })
    }

    return (
        <div className='tw-w-screen tw-h-screen tw-flex' >
            <nav className='tw-w-16 tw-border-r tw-flex tw-flex-col tw-items-center tw-shadow tw-py-5'>
                <NavLink to='/' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                    <FiGrid size={20} />
                </NavLink>
                <NavLink to='/booking-dashboard' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                    <FiBarChart2 size={20} />
                </NavLink>
                <NavLink to='/my-booking' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                    <FiCheckCircle size={20} />
                </NavLink>
                <NavLink to='/booking-periods' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                    <FiCalendar size={20} />
                </NavLink>
            </nav>
            <main className='tw-flex-1 tw-bg-slate-50'>
                <div className='tw-h-14 tw-flex tw-items-center tw-px-5'>
                    <div className='tw-w-60'>

                    </div>
                    <div className='tw-flex-1 tw-flex tw-justify-end tw-items-center tw-gap-5'>
                        <h3>Hi {user?.name}</h3>
                        <IconButton onClick={handleSignOut} color='warning' ><FiLogOut /></IconButton>
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