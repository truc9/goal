import React, { useEffect, useState } from 'react'
import officeBookingService from '../../services/bookingService'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { BookingPeriod } from '../../models/booking'
import dayjs from 'dayjs'
import { PageContainer } from '../../components/PageContainer'
import { FiCalendar } from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { Button } from '@mui/material'

const columns: GridColDef[] = [
    { field: 'from', headerName: 'From', width: 300, valueFormatter: params => dayjs(params?.value).format('ddd DD/MM/YYYY') },
    { field: 'to', headerName: 'To', width: 300, valueFormatter: params => dayjs(params?.value).format('ddd DD/MM/YYYY') },
    {
        field: 'isCurrentPeriod',
        headerName: 'Current Period ?',
        width: 400,
        renderCell: params => params?.value ? <IoCheckmarkCircle size={36} className="tw-text-green-500" /> : null
    },
]

const BookingPeriods: React.FC = () => {

    const [periods, setPeriods] = useState<BookingPeriod[]>([])

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        const res = await officeBookingService.getPeriods()
        setPeriods(res)
    }

    const loadNextPeriod = async () => {
        await officeBookingService.createNextPeriod()
        await load()
    }

    return (
        <PageContainer icon={<FiCalendar size={26} />} title='Office Booking Periods'>
            <div className='tw-flex tw-items-center tw-justify-center'>
                <Button onClick={loadNextPeriod} variant='contained' color="success">Create Period</Button>
            </div>
            <DataGrid
                autoHeight
                rows={periods}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
            />
        </PageContainer>
    )
}

export default BookingPeriods