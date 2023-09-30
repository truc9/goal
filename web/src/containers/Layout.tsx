import React, { FC, ReactNode, Suspense } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiGrid, FiCheckCircle, FiCalendar, FiBarChart2, FiLogOut, FiTriangle } from 'react-icons/fi'
import { Loading } from '../components/Loading'
import useLocalAuth from '../hooks/useLocalAuth'
import { Tooltip } from '@mui/material'

const iconSize = 22

interface PageMenuData {
    path: string
    text?: string
    tooltip?: string
    icon?: ReactNode
    children?: PageMenuData[]
}
const PageMenu: FC<PageMenuData> = ({
    path,
    icon,
    tooltip,
}) => {
    return (
        <Tooltip title={tooltip} placement='right'>
            <NavLink to={path} className='tw-p-3 hover:tw-bg-gradient-to-r [&.active]:tw-bg-gradient-to-r tw-from-rose-500 hover:tw-text-white tw-rounded'>
                {icon}
            </NavLink>
        </Tooltip>
    )
}

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
            <nav className='tw-w-14 tw-bg-blue-900 tw-text-white tw-flex tw-flex-col tw-items-center tw-py-5'>
                <PageMenu tooltip='Dashboard & Modules' icon={<FiGrid size={iconSize} />} path='/' />
                <PageMenu tooltip='My Bookings' icon={<FiCheckCircle size={iconSize} />} path='/my-booking' />
                {user.role == 'admin' && (
                    <>
                        <PageMenu tooltip='Booking Dashboard' icon={<FiBarChart2 size={iconSize} />} path='/booking-dashboard' />
                        <PageMenu tooltip='Booking Periods' icon={<FiCalendar size={iconSize} />} path='/booking-periods' />
                        <PageMenu tooltip='HSE' icon={<FiTriangle size={iconSize} />} path='/hse' />
                    </>
                )}
            </nav>
            <main className='tw-flex-1 tw-bg-slate-100'>
                <div className='tw-h-14 tw-flex tw-items-center tw-px-5 tw-bg-white tw-shadow'>
                    <div className='tw-w-60'>
                        <input type="text" className='tw-px-3 tw-py-2 tw-text-sm tw-border active:tw-outline-none tw-rounded tw-broder-emerald-500 tw-w-[300px]' placeholder='Search...' />
                    </div>
                    <div className='tw-flex-1 tw-flex tw-justify-end tw-items-center tw-gap-5'>
                        <h3>{user?.name}</h3>
                        <Tooltip placement="bottom" title="Signout">
                            <button className='tw-bg-gradient-to-r tw-from-orange-500 tw-to-orange-600 active:tw-translate-x-1 active:tw-translate-y-1 tw-rounded tw-p-2 tw-text-white' onClick={handleSignOut}><FiLogOut size={20} /></button>
                        </Tooltip>
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