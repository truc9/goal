import { useState } from 'react'
import { Tooltip } from '@mui/material'
import {
	DataGrid,
	GridColDef,
	GridRenderCellParams,
	GridValueGetterParams
} from '@mui/x-data-grid'
import { FiPlay, FiRefreshCw, FiStopCircle } from 'react-icons/fi'
import { LabelDateTime } from '../../components/LabelDateTime'
import {
	IoCheckmarkCircle,
	IoInformationCircle,
	IoTicketOutline
} from 'react-icons/io5'
import employeeService from '../../services/employeeService'
import { FC } from 'react'
import { useSnackbar } from 'notistack'
import useBearStore from '../../store'
import { EmployeeModel } from '../../models/employee'
import { EmployeeAssignments } from './EmployeeAssignments'

interface Props {
	loading: boolean
	reload: () => Promise<void>
}

export const EmployeeGrid: FC<Props> = ({ loading, reload }) => {
	const { enqueueSnackbar } = useSnackbar()
	const store = useBearStore()

	// Popups
	const [showAssignmentPopup, setShowAssignmentPopup] = useState(false)

	// States
	const [selectedEmployee, setSelectedEmployee] = useState<EmployeeModel>(
		null!
	)

	// Events
	const deactivateUser = async (id: number) => {
		const data = await employeeService.deactivate(id)
		await reload()
		enqueueSnackbar(`Employee ${data.firstName} is deactivated`, {
			variant: 'warning'
		})
	}

	const activateUser = async (id: number) => {
		const data = await employeeService.activate(id)
		await reload()
		enqueueSnackbar(`Employee ${data.firstName} is activated`, {
			variant: 'success'
		})
	}

	const allocateEmployeeNumber = async (id: number) => {
		await employeeService.allocateEmployeeNumber(id)
		await reload()
	}

	const assignAssessmentClick = (e: EmployeeModel) => {
		setSelectedEmployee(e)
		setShowAssignmentPopup(true)
	}

	const handleAssignmentPopupClose = () => {
		setSelectedEmployee(null!)
		setShowAssignmentPopup(false)
	}

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: '#ID',
			width: 60
		},
		{
			field: 'employeeNumber',
			headerName: 'Employee Number',
			width: 200,
			renderCell(params) {
				const val = params.row.employeeNumber
				return (
					<div className='flex items-center gap-2'>
						<button
							className='btn-secondary'
							onClick={() =>
								allocateEmployeeNumber(params.row.id)
							}>
							<FiRefreshCw />
							{val ? <span>Regen</span> : <span>Gen</span>}
						</button>
						<span className='font-bold text-emerald-500'>
							{val}
						</span>
					</div>
				)
			}
		},
		{
			field: 'fullName',
			headerName: 'Full Name',
			flex: 1,
			valueGetter: (params: GridValueGetterParams) => {
				let fullName = `${params.row.firstName} ${params.row.lastName}`
				if (params.row.employeeNumber) {
					fullName = `${fullName} (${params.row.employeeNumber})`
				}
				return fullName
			}
		},
		{ field: 'email', headerName: 'Email', width: 200 },
		{ field: 'firstName', headerName: 'First Name', width: 100 },
		{ field: 'lastName', headerName: 'Last Name', width: 100 },
		{
			field: 'isActive',
			headerName: 'Active',
			width: 40,
			renderCell(params) {
				return params.value ? (
					<IoCheckmarkCircle size={30} className='text-green-500' />
				) : (
					<IoInformationCircle
						size={30}
						className='text-orange-500'
					/>
				)
			}
		},
		{
			field: 'createdDate',
			headerName: 'Created Date',
			flex: 1,
			renderCell(params) {
				return <LabelDateTime value={params.value} />
			}
		},
		{
			field: 'updatedDate',
			headerName: 'Updated Date',
			flex: 1,
			renderCell(params) {
				return <LabelDateTime value={params.value} />
			}
		},
		{
			field: 'action',
			headerName: '',
			width: 120,
			renderCell(params: GridRenderCellParams) {
				return (
					<div className='flex w-full items-center justify-center gap-2 text-center align-middle'>
						{params.row.isActive ? (
							<Tooltip title='Deactivate user'>
								<button
									className='btn-danger'
									onClick={() =>
										deactivateUser(params.row.id)
									}>
									<FiStopCircle />
								</button>
							</Tooltip>
						) : (
							<Tooltip title='Activate user'>
								<button
									className='btn-primary'
									onClick={() => activateUser(params.row.id)}>
									<FiPlay />
								</button>
							</Tooltip>
						)}
						<Tooltip title='Assign assignment'>
							<button
								className='btn-secondary'
								onClick={() =>
									assignAssessmentClick(params.row)
								}>
								<IoTicketOutline />
							</button>
						</Tooltip>
					</div>
				)
			}
		}
	]

	return (
		<>
			<DataGrid
				key='id'
				rows={store.employees}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 10
						}
					}
				}}
				checkboxSelection={true}
				pageSizeOptions={[10, 20, 50, 100]}
				disableRowSelectionOnClick
				loading={loading}
			/>

			<EmployeeAssignments
				onClose={handleAssignmentPopupClose}
				employee={selectedEmployee}
				show={showAssignmentPopup}
			/>
		</>
	)
}
