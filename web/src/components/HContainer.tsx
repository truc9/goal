import { FC, ReactNode } from 'react'

interface Props {
	children: ReactNode
}

export const HContainer: FC<Props> = ({ children }) => {
	return (
		<div className='flex items-center justify-start gap-2'>{children}</div>
	)
}
