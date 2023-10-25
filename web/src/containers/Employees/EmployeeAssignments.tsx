import { FC, useEffect, useState } from 'react'
import { Popup } from '../../components/Popup'
import { FiFile } from 'react-icons/fi'
import { EmployeeModel } from '../../models/employee'
import { PairItem } from '../../models/pairItem'
import assessmentService from '../../services/assessmentService'
import { IoCheckmarkCircle } from 'react-icons/io5'
import cn from 'classnames'
import { enqueueSnackbar } from 'notistack'
import { Alert } from '@mui/material'
import employeeService from '../../services/employeeService'

interface Props {
	show: boolean
	onClose: VoidFunction
	employee?: EmployeeModel
}

export const EmployeeAssignments: FC<Props> = ({ show, onClose, employee }) => {
	const [selectedItems, setSelectedItems] = useState<PairItem[]>([])
	const [items, setItems] = useState<PairItem[]>([])

	useEffect(() => {
		if (items.length > 0) {
			loadSelectedItems()
		}
	}, [items])

	const loadAllItems = async () => {
		const items = await assessmentService.getAssessmentPairItems()
		setItems(items)
	}

	const loadSelectedItems = async () => {
		if (employee) {
			const assignments = await employeeService.getAssignments(
				employee.id
			)

			setSelectedItems(
				items.filter((item) =>
					assignments.map((a) => a.versionId).includes(item.id)
				)
			)
		}
	}

	const onItemClick = async (item: PairItem) => {
		if (selectedItems.some((s) => s.id === item.id)) {
			await assessmentService.unassign(employee!.id, item.id)
			enqueueSnackbar(`Unselect ${item.name}`, { variant: 'warning' })
			setSelectedItems(selectedItems.filter((s) => s.id !== item.id))
		} else {
			await assessmentService.assign(employee!.id, item.id)
			enqueueSnackbar(`Select ${item.name}`, { variant: 'success' })
			setSelectedItems([...selectedItems, item])
		}
	}

	const handleClose = () => {
		setSelectedItems([])
		onClose()
	}

	const onShow = async () => {
		await loadAllItems()
	}

	return (
		<Popup
			show={show}
			onCloseClicked={handleClose}
			icon={<FiFile />}
			size='sm'
			title='Assign Assessment'
			showFooter={false}
			onShow={onShow}>
			<div className='flex flex-col gap-3'>
				<h3 className='text-center text-3xl'>
					{employee?.firstName} {employee?.lastName}
				</h3>
				{selectedItems.length > 0 ? (
					<Alert color='error'>
						There are {selectedItems.length} outstanding
						assessments.
					</Alert>
				) : (
					<Alert>Yay! You have no assignments.</Alert>
				)}

				<div className='h-[300px] overflow-auto rounded bg-slate-100 p-3 shadow-inner'>
					{items.map((option) => {
						const isSelected = selectedItems.some(
							(s) => s.id === option.id
						)
						return (
							<button
								key={option.id}
								onClick={() => onItemClick(option)}
								className='flex items-center gap-2 hover:font-bold active:translate-x-1 active:translate-y-1'>
								<IoCheckmarkCircle
									size={35}
									className={cn({
										'text-emerald-500': isSelected
									})}
								/>
								<span>{option.name}</span>
							</button>
						)
					})}
				</div>
			</div>
		</Popup>
	)
}
