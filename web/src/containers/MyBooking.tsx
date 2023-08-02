import React, { useEffect, useState } from "react"
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import { IoBookOutline, IoCheckmarkCircle } from "react-icons/io5"
import { PageContainer } from "../components/PageContainer"
import bookingService from "../services/bookingService"
import { BookingPeriod } from "../services/models/booking"
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi"

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
        if (currentPeriod) {
            const days = Array.from(Array(7).keys()).map(d => dayjs(currentPeriod.from).add(d, 'day'))
            setDates(days.map(dd => dd.toDate()))
            loadMyBookings(currentPeriod.id)
        }
    }, [currentPeriod])

    const loadPeriods = async () => {
        const periods = await bookingService.getPeriods()
        const currentPeriod = periods.find(p => p.isCurrentWeek)
        if (currentPeriod) {
            setCurrentPeriod(currentPeriod)
        }
        setPeriods(periods)
    }

    const loadMyBookings = async (bookingPeriodId: string) => {
        const bookings = await bookingService.getUserBookingsByBookingPeriod(bookingPeriodId)
        const dates = bookings.map(booking => ({ date: dayjs(booking.date).date(), bookingId: booking.id }))
        setBookingDates(dates)
    }

    const createBooking = async (bookingPeriodId: string, d: Date) => {
        await bookingService.submitBooking(bookingPeriodId, d)
        loadMyBookings(bookingPeriodId)
    }

    const cancelBooking = async (bookingPeriodId: string, bookingId: string) => {
        await bookingService.cancelBooking(bookingId)
        loadMyBookings(bookingPeriodId)
    }

    const goNext = () => {
        if (currentPeriod) {
            const next = dayjs(currentPeriod.to).add(1, 'day')
            const nextPeriod = periods.find(p => dayjs(p.from).isSame(next))
            setCurrentPeriod(nextPeriod)
        }
        else {
            setCurrentPeriod(periods.find(p => p.isCurrentWeek))
        }
    }

    const goBack = () => {
        if (currentPeriod) {
            const prev = dayjs(currentPeriod.from).subtract(1, 'day')
            const prevPeriod = periods.find(p => dayjs(p.from).isSame(prev))
            setCurrentPeriod(prevPeriod)
        }
        else {
            setCurrentPeriod(periods.find(p => p.isCurrentWeek))
        }
    }

    return (
        <PageContainer icon={<IoBookOutline size={26} />} title="Office Booking">
            <div className="tw-flex tw-flex-col tw-gap-5">
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                    <div className="tw-flex tw-items-center tw-gap-5">
                        <button onClick={goBack} className="tw-p-2 tw-bg-green-500 tw-text-white tw-rounded"><FiChevronLeft size="22" /></button>
                        {currentPeriod ? (
                            <span className="tw-flex tw-items-center tw-gap-3 tw-text-green-500 tw-bg-green-50 tw-p-2 tw-rounded"><FiCalendar /> {dayjs(currentPeriod?.from).format('ddd DD/MMM')} - {dayjs(currentPeriod?.to).format('ddd DD/MMM')}</span>
                        ) : (
                            <span className="tw-text-orange-500 tw-bg-orange-50 tw-p-2 tw-rounded">Period is not opened. Go back current period</span>
                        )}
                        <button onClick={goNext} className="tw-p-2 tw-bg-green-500 tw-text-white tw-rounded"><FiChevronRight size="22" /></button>
                    </div>
                </div>
                {currentPeriod && (
                    <table className='tw-w-full tw-table'>
                        <thead>
                            <tr>
                                {dates.map((d, i) => {
                                    return (
                                        <th key={i} className="tw-h-10 tw-justify-center tw-items-center">{dayjs(d).format('ddd DD/MMM/YYYY')}</th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="tw-table-row">
                                {dates.map((date, i) => {
                                    const booking = bookingDates.find(bd => bd.date == dayjs(date).date())
                                    return (
                                        <td key={i}>
                                            <div className="tw-h-16 tw-flex tw-items-center tw-justify-center tw-transition-all">
                                                {booking
                                                    ? (
                                                        <span onClick={() => cancelBooking(currentPeriod.id, booking.bookingId)} className="tw-text-emerald-500 hover:tw-cursor-pointer active:tw-translate-x-1 active:tw-translate-y-1">
                                                            <IoCheckmarkCircle size={40} />
                                                        </span>
                                                    )
                                                    : (
                                                        <span onClick={() => createBooking(currentPeriod.id, date)} className="tw-text-slate-200 hover:tw-cursor-pointer active:tw-translate-x-1 active:tw-translate-y-1">
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