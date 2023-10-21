import { useEffect, useState } from 'react'
import {
	FiPlay,
	FiPlus,
	FiRefreshCw,
	FiStopCircle,
	FiUpload,
	FiUsers
} from 'react-icons/fi'
import {
	DataGrid,
	GridColDef,
	GridValueGetterParams,
	GridRenderCellParams
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import { PageContainer } from '../../components/PageContainer'
import useBeerStore from '../../store'
import employeeService from '../../services/employeeService'
import { Tooltip } from '@mui/material'
import { IoCheckmarkCircle, IoInformationCircle } from 'react-icons/io5'
import { HContainer } from '../../components/HContainer'
import { LabelDateTime } from '../../components/LabelDateTime'

const Employees = () => {
	const store = useBeerStore()
	const [loading, setLoading] = useState(false)
	const { enqueueSnackbar } = useSnackbar()

	useEffect(() => {
		load()
	}, [])

	const deactivateUser = async (id: number) => {
		const data = await employeeService.deactivate(id)
		await load()
		enqueueSnackbar(`Employee ${data.firstName} is deactivated`, {
			variant: 'warning'
		})
	}

	const activateUser = async (id: number) => {
		const data = await employeeService.activate(id)
		await load()
		enqueueSnackbar(`Employee ${data.firstName} is activated`, {
			variant: 'success'
		})
	}

	const handleAllocEmplNumber = async (id: number) => {
		await employeeService.allocateEmployeeNumber(id)
		await load()
	}

	const load = async () => {
		setLoading(true)
		const employees = await employeeService.getAll()
		store.loadEmployees(employees)
		setLoading(false)
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
					<div className='tw-flex tw-items-center tw-gap-2'>
						<button
							className='btn-secondary'
							onClick={() =>
								handleAllocEmplNumber(params.row.id)
							}>
							<FiRefreshCw />
							{val ? <span>Regen</span> : <span>Gen</span>}
						</button>
						<span className='tw-font-bold tw-text-emerald-500'>
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
					<IoCheckmarkCircle
						size={30}
						className='tw-text-green-500'
					/>
				) : (
					<IoInformationCircle
						size={30}
						className='tw-text-orange-500'
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
			headerName: 'Action',
			width: 100,
			renderCell(params: GridRenderCellParams) {
				return (
					<div className='tw-flex tw-items-center tw-gap-2'>
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
					</div>
				)
			}
		}
	]

	return (
		<PageContainer
			title='Employee Management'
			icon={<FiUsers />}
			action={
				<HContainer>
					<button className='btn-secondary'>
						<FiUpload /> Import
					</button>

					<button className='btn-primary'>
						<FiPlus /> Create
					</button>
				</HContainer>
			}>
			<DataGrid
				key='id'
				rows={store.employees}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5
						}
					}
				}}
				checkboxSelection={true}
				pageSizeOptions={[5]}
				disableRowSelectionOnClick
				loading={loading}
			/>
		</PageContainer>
	)
}

export default Employees
