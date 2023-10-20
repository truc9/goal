import { FC, ReactNode } from 'react'

interface Props {
	children: ReactNode
}

export const HContainer: FC<Props> = ({ children }) => {
	return (
		<div className='tw-flex tw-items-center tw-justify-start tw-gap-2'>
			{children}
		</div>
	)
}
