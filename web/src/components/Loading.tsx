import { RotateSpinner } from 'react-spinners-kit'

export const Loading = () => {
	return (
		<div className='bg-white/30 tw-m-auto tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center'>
			<RotateSpinner size={40} color='#10b981' />
		</div>
	)
}
