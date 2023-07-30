import React, { useEffect, useState } from 'react'
import officeBookingService from '../services/bookingService'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { BookingPeriod } from '../services/models/booking'
import dayjs from 'dayjs'
import { PageContainer } from '../components/PageContainer'
import { FiBookOpen, FiCalendar } from 'react-icons/fi'
import { Button } from '@mui/material'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 300 },
    { field: 'from', headerName: 'From', width: 300, valueFormatter: params => dayjs(params?.value).format('ddd DD/MM/YYYY') },
    { field: 'to', headerName: 'To', width: 300, valueFormatter: params => dayjs(params?.value).format('ddd DD/MM/YYYY') }
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
        await officeBookingService.loadNextPeriod()
        await load()
    }

    return (
        <PageContainer icon={<FiCalendar size={26} />} title='Office Booking Periods'>
            <div>
                <Button onClick={loadNextPeriod} startIcon={<FiBookOpen />} variant='outlined'>Open New Period</Button>
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