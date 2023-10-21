import { RotateSpinner } from 'react-spinners-kit'

export const Loading = () => {
	return (
		<div className='bg-white/30 m-auto flex h-full w-full flex-col items-center'>
			<RotateSpinner size={40} color='#10b981' />
		</div>
	)
}
