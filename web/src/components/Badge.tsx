import { FC, ReactNode } from 'react'
import cn from 'classnames'

interface Props {
	children: ReactNode
	variant: 'success' | 'warning' | 'error'
}

const colorsDict = {
	success: 'tw-bg-emerald-500',
	warning: 'tw-bg-orange-500',
	error: 'tw-bg-red-500'
}

export const Badge: FC<Props> = ({ children, variant }) => {
	const classes = colorsDict[variant]
	return (
		<div
			className={cn(
				'tw-flex tw-items-center tw-gap-2 tw-rounded tw-bg-red-500 tw-p-1 tw-text-xs tw-text-white',
				classes
			)}>
			{children}
		</div>
	)
}
