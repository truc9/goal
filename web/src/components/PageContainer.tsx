import React from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

interface Props {
	title: string
	action?: React.ReactNode
	children?: React.ReactNode
	icon?: React.ReactNode
	showGoBack?: boolean
}

export const PageContainer: React.FC<Props> = ({ title, action, icon, showGoBack, children }) => {
	const navigate = useNavigate()

	return (
		<div className='m-2 flex flex-col gap-5 rounded border bg-white p-5 shadow-sm'>
			<div className='flex items-center justify-between'>
				{showGoBack && (
					<button
						className='flex items-center gap-2 rounded p-2 transition-all hover:bg-slate-100 active:-translate-x-2'
						onClick={() => navigate(-1)}>
						<FiChevronLeft /> <span>Back</span>
					</button>
				)}
				<div className='flex items-center gap-3'>
					{icon && <span className='text-2xl'>{icon}</span>}
					<h3 className='text-2xl'>{title}</h3>
				</div>
				{action}
			</div>
			<div className='flex flex-col gap-3'>{children}</div>
		</div>
	)
}
