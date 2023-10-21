import { useEffect, useState } from 'react'
import { FiPlus, FiUpload, FiUsers } from 'react-icons/fi'
import { PageContainer } from '../../components/PageContainer'
import { HContainer } from '../../components/HContainer'
import { EmployeeGrid } from './EmployeeGrid'
import useBearStore from '../../store'
import employeeService from '../../services/employeeService'
import { Popup } from '../../components/Popup'
import { FileUploader } from '../../components/FileUploader'
import { enqueueSnackbar } from 'notistack'

const Employees = () => {
	const store = useBearStore()
	const [loading, setLoading] = useState(false)
	const [show, setShow] = useState(false)
	const [csv, setCsv] = useState<File>(null!)

	useEffect(() => {
		load()
	}, [])

	const load = async () => {
		setLoading(true)
		const employees = await employeeService.getAll()
		store.loadEmployees(employees)
		setLoading(false)
	}

	const onFileChange = (files: File[]) => {
		console.log(files)
		setCsv(files[0])
	}

	const importFile = async () => {
		try {
			await employeeService.upload(csv)
			enqueueSnackbar('Import successfully', { variant: 'success' })
		} catch (e: any) {
			enqueueSnackbar('Failed to import employee', { variant: 'error' })
		}
	}

	return (
		<PageContainer
			title='Employee Management'
			icon={<FiUsers />}
			action={
				<HContainer>
					<button
						className='btn-secondary'
						onClick={() => setShow(true)}>
						<FiUpload /> Import
					</button>

					<button className='btn-primary'>
						<FiPlus /> Create
					</button>
				</HContainer>
			}>
			<EmployeeGrid loading={loading} reload={load} />

			<Popup
				show={show}
				submitLabel='Import'
				submitIcon={<FiUpload />}
				size='sm'
				title='Import Employee'
				onCloseClicked={() => setShow(false)}
				onSubmitClicked={importFile}>
				<FileUploader onChange={onFileChange} />
			</Popup>
		</PageContainer>
	)
}

export default Employees
