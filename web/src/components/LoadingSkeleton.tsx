import { Skeleton } from '@mui/material'
import React from 'react'

interface Props {
	number: number
}

export const LoadingSkeleton: React.FC<Props> = ({ number }) => {
	return Array.from(Array(number).keys()).map((_: any, index: any) => (
		<Skeleton height={60} key={index} animation='wave' />
	))
}
