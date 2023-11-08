import { FC, useMemo } from 'react'

interface Props {
	defaultValue?: any
	onChange: (value: any) => void
	includeNA?: boolean
}

export const YesNoAnswer: FC<Props> = ({ onChange, defaultValue, includeNA }) => {
	const items = useMemo(() => {
		let response = [
			{ name: 'Yes', value: 1 },
			{ name: 'No', value: 0 }
		]
		if (includeNA) {
			response = [...response, { name: 'No', value: -1 }]
		}
		return response
	}, [includeNA])

	return (
		<div className='flex flex-col'>
			{items.map((c) => {
				return (
					<div key={c.value} className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
						<input
							className='text-2x h-8 w-8'
							type='radio'
							value={c.value}
							name='yesNoNA'
							defaultChecked={defaultValue === c.value}
							onChange={(e) => onChange(e.target.value)}
						/>
						<label htmlFor={`c${c.value}`} className='hover:cursor-pointer'>
							{c.name}
						</label>
					</div>
				)
			})}
		</div>
	)
}
