import { FC, useState } from 'react'
import { Popup } from '../../components/Popup'
import { FiFile } from 'react-icons/fi'
import { Box, Chip, MenuItem, OutlinedInput, Select } from '@mui/material'
import { EmployeeModel } from '../../models/employee'

const names = [
	'Oliver Hansen',
	'Van Henry',
	'April Tucker',
	'Ralph Hubbard',
	'Omar Alexander',
	'Carlos Abbott',
	'Miriam Wagner',
	'Bradley Wilkerson',
	'Virginia Andrews',
	'Kelly Snyder'
]

interface Props {
	show: boolean
	onClose: VoidFunction
	employee?: EmployeeModel
}

export const EmployeeAssignments: FC<Props> = ({ show, onClose, employee }) => {
	const [assessments, setAssessments] = useState<string[]>([])

	const handleChange = (event: any) => {
		const {
			target: { value }
		} = event

		setAssessments(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		)
	}

	const handleClose = () => {
		setAssessments([])
		onClose()
	}

	return (
		<Popup
			show={show}
			onCloseClicked={handleClose}
			icon={<FiFile />}
			size='sm'
			title='Assign Assessment'>
			<div className='flex flex-col gap-5'>
				<h3 className='text-center font-bold text-3xl'>
					{employee?.firstName} {employee?.lastName}
				</h3>
				<Select
					labelId='demo-multiple-chip-label'
					id='demo-multiple-chip'
					multiple
					value={assessments}
					onChange={handleChange}
					input={
						<OutlinedInput id='select-multiple-chip' label='Chip' />
					}
					renderValue={(selected) => (
						<Box
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: 0.5
							}}>
							{selected.map((value) => (
								<Chip key={value} label={value} />
							))}
						</Box>
					)}>
					{names.map((name) => (
						<MenuItem key={name} value={name}>
							{name}
						</MenuItem>
					))}
				</Select>
			</div>
		</Popup>
	)
}
