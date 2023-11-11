import { FC, useMemo } from 'react'

interface Props {
	value?: any
	onChange: (value: any) => void
	includeNA?: boolean
}

export const YesNoAnswer: FC<Props> = ({ onChange, value, includeNA }) => {
	const v = useMemo(() => (value ? Number(value) : null), [value])
	const items = useMemo(() => {
		let response = [
			{ name: 'Yes', value: 1 },
			{ name: 'No', value: 0 }
		]
		if (includeNA) {
			response = [...response, { name: 'N/A', value: -1 }]
		}
		return response
	}, [includeNA])

	return (
		<div className='flex flex-col'>
			{items.map((c) => {
				return (
					<div key={c.value} className='flex items-center rounded-lg p-3 hover:bg-slate-200'>
						<input
							className='text-2x h-8 w-8'
							type='radio'
							value={c.value}
							id={`select_${c.value}`}
							name='yesNoNA'
							checked={v === c.value}
							onChange={(e) => onChange(e.target.value)}
						/>
						<label htmlFor={`select_${c.value}`} className='hover:cursor-pointer'>
							<span className='ml-5'>{c.name}</span>
						</label>
					</div>
				)
			})}
		</div>
	)
}
