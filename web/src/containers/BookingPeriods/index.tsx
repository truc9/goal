import React, { useEffect, useState } from 'react'

import dayjs from 'dayjs'
import _ from 'lodash'
import { FiCalendar, FiRefreshCw } from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { PageContainer } from '../../components/PageContainer'
import { BookingPeriod } from '../../models/booking'
import officeBookingService from '../../services/bookingService'

const columns: GridColDef[] = [
	{
		field: 'from',
		headerName: 'From',
		flex: 1,
		valueFormatter: (params) =>
			dayjs(params?.value).format('ddd DD/MM/YYYY')
	},
	{
		field: 'to',
		headerName: 'To',
		flex: 1,
		valueFormatter: (params) =>
			dayjs(params?.value).format('ddd DD/MM/YYYY')
	},
	{
		field: 'isCurrentPeriod',
		headerName: 'Current',
		flex: 1,
		renderCell: (params) =>
			params?.value ? (
				<IoCheckmarkCircle size={36} className='text-green-500' />
			) : null
	}
]

const BookingPeriods: React.FC = () => {
	const [periods, setPeriods] = useState<BookingPeriod[]>([])

	useEffect(() => {
		load()
	}, [])

	const load = async () => {
		const data = await officeBookingService.getPeriods()
		setPeriods(_.orderBy(data, (item) => item.from, 'desc'))
	}

	const loadNextPeriod = async () => {
		await officeBookingService.createNextPeriod()
		await load()
	}

	return (
		<PageContainer
			icon={<FiCalendar />}
			title='Office Booking Periods'
			action={
				<button className='btn-secondary' onClick={loadNextPeriod}>
					<FiRefreshCw className='animate-spin' />
					<span>Refresh</span>
				</button>
			}>
			<DataGrid
				autoHeight
				rows={periods}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 100 }
					}
				}}
			/>
		</PageContainer>
	)
}

export default BookingPeriods
