import { FC } from 'react'

interface Props {
	choices: any[]
	displayMember: string
	valueMember: string
	defaultValue?: any
	onChange: (e: any) => void
}

export const SingleChoiceAnswer: FC<Props> = ({ choices, displayMember, valueMember, defaultValue, onChange }) => {
	return (
		<div className='flex flex-col'>
			{choices.map((choice) => {
				return (
					<div
						key={choice[valueMember]}
						className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
						<input
							className='text-2x h-8 w-8'
							type='radio'
							value={choice[valueMember]}
							name='singleChoice'
							defaultChecked={defaultValue === choice[valueMember]}
							onChange={(e) => onChange(e.target.value)}
						/>
						<label htmlFor={`c${choice[valueMember]}`} className='hover:cursor-pointer'>
							{choice[displayMember]}
						</label>
					</div>
				)
			})}
		</div>
	)
}
