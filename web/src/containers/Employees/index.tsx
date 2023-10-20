import { useEffect } from 'react'
import {
	FiChevronRight,
	FiEdit,
	FiTrash,
	FiUpload,
	FiUsers
} from 'react-icons/fi'
import {
	DataGrid,
	GridColDef,
	GridValueGetterParams,
	GridRenderCellParams
} from '@mui/x-data-grid'
import { PageContainer } from '../../components/PageContainer'
import useBeerStore from '../../store'
import employeeService from '../../services/employeeService'

const Employees = () => {
	const store = useBeerStore()

	useEffect(() => {
		load()
	}, [])

	const handleEdit = (id: number) => {
		console.log(id)
	}

	const handleDelete = (id: number) => {
		console.log(id)
	}

	const handleAllocEmplNumber = async (id: number) => {
		await employeeService.allocateEmployeeNumber(id)
		await load()
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
							<FiChevronRight />
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
		{ field: 'firstName', headerName: 'First Name', flex: 1 },
		{ field: 'lastName', headerName: 'Last Name', flex: 1 },
		{
			field: 'action',
			headerName: 'Action',
			width: 100,
			renderCell(params: GridRenderCellParams) {
				return (
					<div className='tw-flex tw-items-center tw-gap-2'>
						<button
							className='btn-secondary'
							onClick={() => handleEdit(params.row.id)}>
							<FiEdit />
						</button>

						<button
							className='btn-danger'
							onClick={() => handleDelete(params.row.id)}>
							<FiTrash />
						</button>
					</div>
				)
			}
		}
	]

	const load = async () => {
		const employees = await employeeService.getAll()
		store.loadEmployees(employees)
	}

	return (
		<PageContainer
			title='Employee Management'
			icon={<FiUsers />}
			action={
				<div>
					<button className='btn-primary'>
						<FiUpload /> Import
					</button>
				</div>
			}>
			<DataGrid
				rows={store.employees}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5
						}
					}
				}}
				pageSizeOptions={[5]}
				disableRowSelectionOnClick
			/>
		</PageContainer>
	)
}

export default Employees
