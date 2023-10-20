import React, { FC, ReactNode, Suspense } from 'react'

import {
	FiCalendar,
	FiCheckCircle,
	FiGrid,
	FiLogOut,
	FiPlus,
	FiUsers
} from 'react-icons/fi'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Tooltip } from '@mui/material'

import { Loading } from '../components/Loading'
import useLocalAuth from '../hooks/useLocalAuth'
import useBeerStore from '../store'
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
				className='tw-rounded tw-from-violet-300 tw-to-violet-500 tw-p-3 hover:tw-bg-gradient-to-r hover:tw-text-white [&.active]:tw-bg-gradient-to-r'>
				{icon}
			</NavLink>
		</Tooltip>
	)
}

const Layout: React.FC = () => {
	const actions = useBeerStore((state) => state.actions)

	const { user, signout } = useLocalAuth()
	const navigate = useNavigate()

	function handleSignOut() {
		signout(() => {
			navigate('/login', { replace: true })
		})
	}

	return (
		<div className='tw-flex tw-h-screen tw-overflow-hidden'>
			<nav className='tw-flex tw-w-14 tw-flex-col tw-items-center tw-bg-violet-500 tw-py-5 tw-text-white'>
				<PageMenu
					tooltip='Dashboard & Modules'
					icon={<FiGrid size={iconSize} />}
					path='/'
				/>
				<PageMenu
					tooltip='My Bookings'
					icon={<FiCheckCircle size={iconSize} />}
					path='/my-booking'
				/>
				{user.role == 'admin' && (
					<>
						<PageMenu
							tooltip='Booking Dashboard'
							icon={<IoBarChart size={iconSize} />}
							path='/booking-dashboard'
						/>
						<PageMenu
							tooltip='Booking Periods'
							icon={<FiCalendar size={iconSize} />}
							path='/booking-periods'
						/>
						<PageMenu
							tooltip='Assessment Setup'
							icon={<FiCheckCircle size={iconSize} />}
							path='/assessments'
						/>
						<PageMenu
							tooltip='Employees'
							icon={<FiUsers size={iconSize} />}
							path='/employees'
						/>
					</>
				)}
			</nav>
			<main className='tw-flex tw-flex-1 tw-flex-col tw-bg-slate-100'>
				<div className='tw-flex tw-h-16 tw-shrink-0 tw-grow-0 tw-items-center tw-justify-between tw-gap-3 tw-bg-white tw-px-2 tw-shadow'>
					<div className='tw-w-60'>
						<input
							type='text'
							className='tw-w-[300px]'
							placeholder='Search...'
						/>
					</div>
					<div className='tw-flex tw-items-center'>
						{actions.map((action: TopbarAction) => {
							return (
								<button
									className='btn-secondary'
									onClick={action.actionFn}>
									{action.key === 'addAssessment' && (
										<FiPlus />
									)}
									{action.name}
								</button>
							)
						})}
					</div>
					<div className='tw-flex tw-flex-1 tw-items-center tw-justify-end tw-gap-5'>
						<h3 className='tw-text-sm'>Hello, {user?.name}!</h3>
						<Tooltip placement='bottom' title='Signout'>
							<button
								className='btn-warning'
								onClick={handleSignOut}>
								<span>Signout</span>
								<FiLogOut />
							</button>
						</Tooltip>
					</div>
				</div>
				<div className='tw-flex-1 tw-overflow-y-auto'>
					<Suspense
						fallback={
							<div className='tw-flex tw-items-center tw-gap-3 tw-p-10'>
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
