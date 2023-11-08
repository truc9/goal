import React, { FC, ReactNode, Suspense } from 'react'
import { FiCalendar, FiCheckCircle, FiFileText, FiGrid, FiLogOut, FiPlus, FiTarget, FiUsers } from 'react-icons/fi'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Tooltip } from '@mui/material'
import { Loading } from '../components/Loading'
import useLocalAuth from '../hooks/useLocalAuth'
import useBearStore from '../store'
import { TopbarAction } from '../store/topbarSlice'
import { IoBarChart } from 'react-icons/io5'

const iconSize = 22

interface PageMenuData {
	path: string
	text?: string
	tooltip?: string
	icon?: ReactNode
	children?: PageMenuData[]
}
const PageMenu: FC<PageMenuData> = ({ path, icon, tooltip }) => {
	return (
		<Tooltip title={tooltip} placement='right'>
			<NavLink
				to={path}
				className='rounded from-emerald-300 to-emerald-500 p-3 hover:bg-gradient-to-r hover:text-white [&.active]:bg-gradient-to-r'>
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
		<div className='flex h-screen overflow-hidden'>
			<nav className='flex w-14 flex-col items-center bg-emerald-500 py-5 text-white'>
				<PageMenu tooltip='Dashboard & Modules' icon={<FiGrid size={iconSize} />} path='/' />
				<PageMenu tooltip='My Bookings' icon={<FiCheckCircle size={iconSize} />} path='/my-booking' />
				<PageMenu tooltip='My Assessment' icon={<FiTarget size={iconSize} />} path='/my-assessment' />
				{user.role == 'admin' && (
					<>
						<PageMenu
							tooltip='Booking Overview'
							icon={<IoBarChart size={iconSize} />}
							path='/dashboard/booking-overview'
						/>
						<PageMenu
							tooltip='Booking Periods'
							icon={<FiCalendar size={iconSize} />}
							path='/booking-periods'
						/>
						<PageMenu
							tooltip='Assessment Setup'
							icon={<FiFileText size={iconSize} />}
							path='/assessments'
						/>
						<PageMenu tooltip='Employees' icon={<FiUsers size={iconSize} />} path='/employees' />
					</>
				)}
			</nav>
			<main className='flex flex-1 flex-col bg-slate-100'>
				<div className='flex h-16 shrink-0 grow-0 items-center justify-between gap-3 bg-white px-2 shadow'>
					<div className='w-60'>
						<input type='text' className='w-[300px]' placeholder='Search...' />
					</div>
					<div className='flex items-center'>
						{actions.map((action: TopbarAction) => {
							return (
								<button className='btn-secondary' onClick={action.actionFn}>
									{action.key === 'addAssessment' && <FiPlus />}
									{action.name}
								</button>
							)
						})}
					</div>
					<div className='flex flex-1 items-center justify-end gap-5'>
						<h3 className='text-sm'>Hello, {user?.name}!</h3>
						<Tooltip placement='bottom' title='Signout'>
							<button className='btn-warning' onClick={handleSignOut}>
								<span>Signout</span>
								<FiLogOut />
							</button>
						</Tooltip>
					</div>
				</div>
				<div className='flex-1 overflow-y-auto'>
					<Suspense
						fallback={
							<div className='flex items-center gap-3 p-10'>
								<Loading />
							</div>
						}>
						<Outlet />
					</Suspense>
				</div>
			</main>
		</div>
	)
}

export default Layout
