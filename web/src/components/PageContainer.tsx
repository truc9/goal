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

export const PageContainer: React.FC<Props> = ({
	title,
	action,
	icon,
	showGoBack,
	children
}) => {
	const navigate = useNavigate()

	return (
		<div className='tw-m-2 tw-flex tw-flex-col tw-gap-5 tw-rounded tw-border tw-bg-white tw-p-5 tw-shadow'>
			<div className='tw-flex tw-items-center tw-justify-between'>
				{showGoBack && (
					<button
						className='tw-flex tw-items-center tw-gap-2 tw-rounded tw-p-2 tw-transition-all hover:tw-bg-slate-100 active:-tw-translate-x-2'
						onClick={() => navigate(-1)}>
						<FiChevronLeft /> <span>Back</span>
					</button>
				)}
				<div className='tw-flex tw-items-center tw-gap-3 tw-font-bold'>
					{icon && <span className='tw-text-lg'>{icon}</span>}
					<h3 className='tw-text-lg'>{title}</h3>
				</div>
				{action}
			</div>
			<div className='tw-flex tw-flex-col tw-gap-3'>{children}</div>
		</div>
	)
}
