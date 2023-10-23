import { FC, useEffect, useState } from 'react'
import { Popup } from '../../components/Popup'
import { FiFile } from 'react-icons/fi'
import { EmployeeModel } from '../../models/employee'
import { PairItem } from '../../models/pairItem'
import assessmentService from '../../services/assessmentService'
import { IoCheckmarkCircle } from 'react-icons/io5'
import cn from 'classnames'

interface Props {
	show: boolean
	onClose: VoidFunction
	employee?: EmployeeModel
}

export const EmployeeAssignments: FC<Props> = ({ show, onClose, employee }) => {
	const [selectedItems, setSelectedItems] = useState<PairItem[]>([])
	const [assessmentOptions, setAssessmentOptions] = useState<PairItem[]>([])

	useEffect(() => {
		load()
	}, [])

	const load = async () => {
		const assessmentOptions =
			await assessmentService.getAssessmentPairItems()
		setAssessmentOptions(assessmentOptions)
	}

	const onItemClick = (item: PairItem) => {
		if (selectedItems.some((s) => s.id === item.id)) {
			setSelectedItems(selectedItems.filter((si) => si.id !== item.id))
		} else {
			setSelectedItems([...selectedItems, item])
		}
	}

	const handleClose = () => {
		setSelectedItems([])
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
				<h3 className='text-center text-3xl font-bold'>
					{employee?.firstName} {employee?.lastName}
				</h3>
				<div className='h-[300px] overflow-auto'>
					{assessmentOptions.map((option) => {
						const isSelected = selectedItems.some(
							(s) => s.id === option.id
						)
						return (
							<button
								onClick={() => onItemClick(option)}
								className='flex items-center gap-2 hover:font-bold active:translate-x-1 active:translate-y-1'>
								<IoCheckmarkCircle
									size={26}
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
