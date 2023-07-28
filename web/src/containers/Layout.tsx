import React, { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { FiGrid, FiActivity, FiCheckCircle } from 'react-icons/fi'
import { Loading } from '../components/Loading'

const Layout: React.FC = () => (
    <div className='tw-w-screen tw-h-screen tw-flex bg-slate-50'>
        <nav className='tw-w-16 tw-bg-white tw-flex tw-flex-col tw-items-center tw-shadow tw-py-5'>
            <NavLink to='/' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                <FiGrid size={28} />
            </NavLink>
            <NavLink to='/office-booking' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                <FiCheckCircle size={28} />
            </NavLink>
            <NavLink to='/components' className='tw-p-3 hover:tw-bg-green-500 hover:tw-text-white tw-rounded'>
                <FiActivity size={28} />
            </NavLink>
        </nav>
        <main className='tw-bg-slate-100 tw-flex-1 tw-p-5'>
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </main>
    </div>
)

export default Layout