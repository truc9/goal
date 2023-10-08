import React, {
    FC,
    ReactNode,
    Suspense,
} from 'react'

import {
    FiBarChart2,
    FiCalendar,
    FiCheckCircle,
    FiFile,
    FiGrid,
    FiLogOut,
    FiPlus,
} from 'react-icons/fi'
import {
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom'

import { Tooltip } from '@mui/material'

import { Loading } from '../components/Loading'
import useLocalAuth from '../hooks/useLocalAuth'
import useBearStore, { GlobalAction } from '../store'

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
            <NavLink to={path} className='tw-p-3 hover:tw-bg-lime-400 [&.active]:tw-bg-lime-400 hover:tw-text-white tw-rounded'>
                {icon}
            </NavLink>
        </Tooltip>
    )
}

const Layout: React.FC = () => {
    const actions = useBearStore((state) => state.actions)

    const { user, signout } = useLocalAuth()
    const navigate = useNavigate()

    function handleSignOut() {
        signout(() => {
            navigate('/login', { replace: true })
        })
    }

    return (
        <div className='tw-flex tw-h-screen tw-overflow-hidden'>
            <nav className='tw-w-14 tw-bg-lime-500 tw-text-white tw-flex tw-flex-col tw-items-center tw-py-5'>
                <PageMenu tooltip='Dashboard & Modules' icon={<FiGrid size={iconSize} />} path='/' />
                <PageMenu tooltip='My Bookings' icon={<FiCheckCircle size={iconSize} />} path='/my-booking' />
                {user.role == 'admin' && (
                    <>
                        <PageMenu tooltip='Booking Dashboard' icon={<FiBarChart2 size={iconSize} />} path='/booking-dashboard' />
                        <PageMenu tooltip='Booking Periods' icon={<FiCalendar size={iconSize} />} path='/booking-periods' />
                        <PageMenu tooltip='Assessment Setup' icon={<FiFile size={iconSize} />} path='/assessments' />
                    </>
                )}
            </nav>
            <main className='tw-flex-1 tw-flex tw-flex-col tw-bg-slate-100'>
                <div className='tw-h-16 tw-shrink-0 tw-grow-0 tw-flex tw-items-center tw-px-2 tw-bg-white tw-shadow tw-justify-between tw-gap-3'>
                    <div className='tw-w-60'>
                        <input type="text" className='tw-w-[300px]' placeholder='Search...' />
                    </div>
                    <div className='tw-flex tw-items-center'>
                        {actions.map((action: GlobalAction) => {
                            return (
                                <button className='btn-secondary' onClick={action.actionFn}>{action.key === 'addAssessment' && <FiPlus />}{action.name}</button>
                            )
                        })}
                    </div>
                    <div className='tw-flex-1 tw-flex tw-justify-end tw-items-center tw-gap-5'>
                        <h3>{user?.name}</h3>
                        <Tooltip placement="bottom" title="Signout">
                            <button className='btn-secondary' onClick={handleSignOut}><FiLogOut /></button>
                        </Tooltip>
                    </div>
                </div>
                <div className='tw-flex-1 tw-overflow-y-auto'>
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div >
    )
}

export default Layout