import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import { IoBookOutline, IoCheckmarkCircle } from "react-icons/io5"
import { PageContainer } from "../components/PageContainer"
import bookingService from "../services/bookingService"
import { MenuItem, Select } from "@mui/material"
import { BookingPeriod } from "../services/models/booking"
import { FiCalendar, FiInfo } from "react-icons/fi"

dayjs.extend(weekday)

interface BookingDate {
    bookingId: string
    date: number
}

const MyBooking: React.FC = () => {
    const [periods, setPeriods] = useState<BookingPeriod[]>([])
    const [currentPeriod, setCurrentPeriod] = useState<BookingPeriod>()
    const [dates, setDates] = useState<Date[]>([])
    const [bookingDates, setBookingDates] = useState<BookingDate[]>([])

    useEffect(() => {
        loadPeriods()
    }, [])

    useEffect(() => {
        const days = Array.from(Array(7).keys()).map(d => dayjs(currentPeriod?.from).add(d, 'day'))
        setDates(days.map(dd => dd.toDate()))
    }, [currentPeriod])

    const loadPeriods = async () => {
        const result = await bookingService.getPeriods()
        setPeriods(result)
    }

    const loadBookings = async (bookingPeriodId: string) => {
        const bookings = await bookingService.getUserBookingsByBookingPeriod(bookingPeriodId)
        const dates = bookings.map(booking => ({ date: dayjs(booking.date).date(), bookingId: booking.id }))
        setBookingDates(dates)
    }

    const book = async (bookingPeriodId: string, d: Date) => {
        await bookingService.submitBooking(bookingPeriodId, d)
        loadBookings(bookingPeriodId)
    }

    const cancelBooking = async (bookingPeriodId: string, bookingId: string) => {
        await bookingService.cancelBooking(bookingId)
        loadBookings(bookingPeriodId)
    }

    const handleChangePeriod = (e: any) => {
        const current = periods.find(p => p.id === e.target.value)
        setCurrentPeriod(current)
        if (current) {
            loadBookings(current.id)
        }
    }

    return (
        <PageContainer icon={<IoBookOutline size={26} />} title="Office Booking">
            <div className="tw-flex tw-flex-col tw-gap-5">
                <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-w-[300px]">
                        <Select
                            fullWidth
                            onChange={handleChangePeriod}
                        >
                            {periods.map((p, k) => (
                                <MenuItem key={k} value={p.id}>{dayjs(p.from).format('DD/MM/YYYY')} - {dayjs(p.to).format('DD/MM/YYYY')}</MenuItem>
                            ))}
                        </Select>
                    </div>
                    {currentPeriod ? (
                        <div>
                            <span className="tw-flex tw-items-center tw-gap-3 tw-text-green-500 tw-bg-green-50 tw-p-2 tw-rounded"><FiCalendar /> {dayjs(currentPeriod?.from).format('ddd DD/MMM')} - {dayjs(currentPeriod?.to).format('ddd DD/MMM')}</span>
                        </div>
                    ) : (
                        <h3 className="tw-flex tw-items-center tw-gap-3 tw-text-orange-500"><FiInfo /> No Period Selected</h3>
                    )}
                </div>
                {currentPeriod && (
                    <table className='tw-w-full tw-table tw-border'>
                        <thead>
                            <tr>
                                {dates.map((d, i) => {
                                    return (
                                        <th key={i} className="tw-border tw-h-10 tw-justify-center tw-items-center">{dayjs(d).format('ddd DD/MMM/YYYY')}</th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="tw-table-row">
                                {dates.map((date, i) => {
                                    const booking = bookingDates.find(bd => bd.date == dayjs(date).date())
                                    return (
                                        <td key={i} className="tw-border">
                                            <div className="tw-h-16 tw-flex tw-items-center tw-justify-center tw-transition-all">
                                                {booking
                                                    ? (
                                                        <span onClick={() => cancelBooking(currentPeriod.id, booking.bookingId)} className="tw-text-emerald-500 hover:tw-cursor-pointer active:tw-translate-x-1 active:tw-translate-y-1">
                                                            <IoCheckmarkCircle size={40} />
                                                        </span>
                                                    )
                                                    : (
                                                        <span onClick={() => book(currentPeriod.id, date)} className="tw-text-orange-500 hover:tw-cursor-pointer active:tw-translate-x-1 active:tw-translate-y-1">
                                                            <IoCheckmarkCircle size={40} />
                                                        </span>
                                                    )
                                                }
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </PageContainer>
    )
}

export default MyBooking