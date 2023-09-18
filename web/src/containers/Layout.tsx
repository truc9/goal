import React, { Suspense } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiGrid, FiCheckCircle, FiCalendar, FiBarChart2, FiLogOut } from 'react-icons/fi'
import { Loading } from '../components/Loading'
import useLocalAuth from '../hooks/useLocalAuth'

const iconSize = 22

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
            <nav className='tw-w-14 tw-bg-blue-700 tw-text-white tw-flex tw-flex-col tw-items-center tw-py-5'>
                <NavLink to='/' className='tw-p-3 hover:tw-bg-blue-500 hover:tw-text-white tw-rounded'>
                    <FiGrid size={iconSize} />
                </NavLink>
                <NavLink to='/my-booking' className='tw-p-3 hover:tw-bg-blue-500 hover:tw-text-white tw-rounded'>
                    <FiCheckCircle size={iconSize} />
                </NavLink>
                {user.role == 'admin' && (
                    <>
                        <NavLink to='/booking-dashboard' className='tw-p-3 hover:tw-bg-blue-500 hover:tw-text-white tw-rounded'>
                            <FiBarChart2 size={iconSize} />
                        </NavLink>
                        <NavLink to='/booking-periods' className='tw-p-3 hover:tw-bg-blue-500 hover:tw-text-white tw-rounded'>
                            <FiCalendar size={iconSize} />
                        </NavLink>
                    </>
                )}
            </nav>
            <main className='tw-flex-1 tw-bg-slate-50'>
                <div className='tw-h-14 tw-flex tw-items-center tw-px-5 tw-bg-white tw-shadow'>
                    <div className='tw-w-60'>
                        <input type="text" className='tw-px-3 tw-py-2 tw-text-sm tw-border active:tw-outline-none tw-rounded tw-broder-emerald-500 tw-w-[300px]' placeholder='Search...' />
                    </div>
                    <div className='tw-flex-1 tw-flex tw-justify-end tw-items-center tw-gap-5'>
                        <h3>{user?.name}</h3>
                        <button className='tw-bg-orange-500 active:tw-translate-x-1 active:tw-translate-y-1 tw-rounded tw-p-1 tw-text-white' onClick={handleSignOut}><FiLogOut size={20} /></button>
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