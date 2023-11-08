import React from 'react'
import { Loading } from './Loading'

interface Props {
	loading: boolean
	children: React.ReactNode
}

export const AsyncContent: React.FC<Props> = ({ loading, children }) => {
	if (loading)
		return (
			<div className='p-5'>
				<Loading />
			</div>
		)
	return <div>{children}</div>
}
