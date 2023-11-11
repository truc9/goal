import { FC, useEffect, useState } from 'react'

type Props = {
	choices: any[]
	displayMember: string
	valueMember: string
	defaultValues?: any[]
	onChange: (values: any[]) => void
}

export const MultiChoicesAnswer: FC<Props> = ({ choices, displayMember, valueMember, defaultValues, onChange }) => {
	const [values, setValues] = useState<any[]>([])

	useEffect(() => {
		onChange(values)
	}, [values])

	const handleChange = (e: any) => {
		if (e.target.checked) {
			setValues([...values, e.target.value])
		} else {
			setValues(values.filter((s) => s !== e.target.value))
		}
	}

	return (
		<div className='flex flex-col'>
			{choices.map((choice) => {
				return (
					<div
						key={choice[valueMember]}
						className='flex items-center gap-3 rounded-lg p-3 hover:bg-slate-200'>
						<input
							className='text-2x h-8 w-8'
							type='checkbox'
							value={choice[valueMember]}
							checked={defaultValues && defaultValues?.find((v) => v == choice[valueMember])}
							onChange={handleChange}
						/>
						<label htmlFor={`c${choice.id}`} className='hover:cursor-pointer'>
							{choice[displayMember]}
						</label>
					</div>
				)
			})}
		</div>
	)
}
