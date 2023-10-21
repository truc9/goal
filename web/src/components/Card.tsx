import { FC, ReactNode } from 'react'

interface Props {
	children: ReactNode
	title?: string
}

export const Card: FC<Props> = ({ children, title }) => {
	return (
		<div className='flex flex-col items-center gap-3 rounded border bg-slate-50 p-5 text-center text-slate-500'>
			<div className='flex flex-1 flex-col items-center justify-center'>
				{children}
			</div>
			<div className='font-bold'>{title}</div>
		</div>
	)
}
