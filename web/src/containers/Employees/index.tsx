import { useEffect } from 'react'
import { FiEdit, FiTrash, FiUpload, FiUsers } from 'react-icons/fi'
import {
	DataGrid,
	GridColDef,
	GridValueGetterParams,
	GridRenderCellParams
} from '@mui/x-data-grid'
import { PageContainer } from '../../components/PageContainer'
import useBeerStore from '../../store'
import employeeService from '../../services/employeeService'
import { Chip } from '@mui/material'

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

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: '#ID',
			width: 60
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
			field: 'employeeNumber',
			headerName: 'Employee Number',
			width: 150,
			renderCell(params) {
				const val = params.row.employeeNumber
				if (val) {
					return <span>{val}</span>
				}
				return <Chip label='Unset' size='small' color='error'></Chip>
			}
		},
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
