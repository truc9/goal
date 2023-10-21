import { FC, ReactNode } from 'react'
import cn from 'classnames'

interface Props {
	children: ReactNode
	variant: 'success' | 'warning' | 'error'
}

const colorsDict = {
	success: 'bg-emerald-500',
	warning: 'bg-orange-500',
	error: 'bg-red-500'
}

export const Badge: FC<Props> = ({ children, variant }) => {
	const classes = colorsDict[variant]
	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded bg-red-500 p-1 text-xs text-white',
				classes
			)}>
			{children}
		</div>
	)
}
