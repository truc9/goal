import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
	disabled?: boolean
	title: string
	subTitle: string
	link: string
	icon: React.ReactNode
}

export const ClickableCard: React.FC<Props> = ({
	title,
	subTitle,
	link,
	icon,
	disabled
}) => {
	const content = (
		<>
			<span>{icon}</span>
			<h3 className='text-2xl'>{title}</h3>
			<h5 className='text-xs text-black/40'>{subTitle}</h5>
		</>
	)

	if (disabled) {
		return (
			<div className='flex flex-col items-center gap-3 rounded bg-slate-200 p-5 text-center text-black/40'>
				{content}
			</div>
		)
	}

	return (
		<Link
			to={link}
			className='flex flex-col items-center gap-3 rounded border border-slate-200 bg-slate-50 p-5 text-center hover:bg-slate-100'>
			{content}
		</Link>
	)
}
