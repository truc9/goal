import React, {
    useEffect,
    useState,
} from 'react'

import cn from 'classnames'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import {
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi'
import {
    IoBookOutline,
    IoCheckmarkCircle,
    IoLockClosedSharp,
} from 'react-icons/io5'

import { PageContainer } from '../../components/PageContainer'
import useWebSocket from '../../hooks/useWebSocket'
import { BookingPeriod } from '../../models/booking'
import bookingService from '../../services/bookingService'

dayjs.extend(weekday)

interface BookingDate {
    bookingId: number
    date: number
}

const MyBooking: React.FC = () => {
    const [periods, setPeriods] = useState<BookingPeriod[]>([])

    const [period, setPeriod] = useState<BookingPeriod>()

    const [dates, setDates] = useState<Date[]>([])

    const [bookingDates, setBookingDates] = useState<BookingDate[]>([])

    const [index, setIndex] = useState(0)

    const ws = useWebSocket()

    useEffect(() => {
        loadPeriods()
    }, [])

    useEffect(() => {
        if (period) {
            const days = Array.from(Array(7).keys()).map(d => dayjs(period.from).add(d, 'day'))
            setDates(days.map(dd => dd.toDate()))
            loadMyBookings(period.id)
        }
    }, [period])

    useEffect(() => {
        if (index >= 0 && index <= periods.length - 1) {
            setPeriod(periods[index])
        }
    }, [index, periods])

    async function loadPeriods() {
        const periods = await bookingService.getPeriods()
        const currentPeriod = periods.find(p => p.isCurrentPeriod)
        if (currentPeriod) {
            setPeriod(currentPeriod)
        }

        setPeriods(periods)

        const index = periods.findIndex(p => p.isCurrentPeriod)
        setIndex(index)
    }

    const loadMyBookings = async (periodId: number) => {
        const bookings = await bookingService.getMyBookings(periodId)
        const dates = bookings.map(booking => ({ date: dayjs(booking.date).date(), bookingId: booking.id }))
        setBookingDates(dates)
    }

    const createBooking = async (periodId: number, d: Date) => {
        await bookingService.createBooking(periodId, d)
        loadMyBookings(periodId)
        ws.send("booking_updated")
    }

    const cancelBooking = async (periodId: number, bookingId: number) => {
        await bookingService.deleteBooking(bookingId)
        loadMyBookings(periodId)
        ws.send("booking_updated")
    }

    const goNext = () => {
        if (index < periods.length - 1) {
            setIndex(index + 1)
        }
    }

    const goBack = () => {
        if (index > 0) {
            setIndex(index - 1)
        }
    }

    return (
        <PageContainer icon={<IoBookOutline />} title="My Booking">
            <div className="tw-flex tw-flex-col tw-gap-5">
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
                    <div className="tw-flex tw-items-center tw-gap-1 tw-px-1 tw-py-1 tw-rounded tw-bg-orange-50 tw-border-orange-100 tw-border">
                        <button disabled={index === 0} onClick={goBack} className="disabled:tw-bg-slate-200 tw-p-1 tw-shadow-lg tw-bg-orange-500 tw-text-white tw-rounded"><FiChevronLeft size="26" /></button>
                        {period ? (
                            <span className="tw-flex tw-items-center tw-gap-3 tw-text-orange-500 tw-p-2 tw-rounded">{dayjs(period?.from).format('DD MMM YYYY')} - {dayjs(period?.to).format('DD MMM YYYY')}</span>
                        ) : (
                            <span className="tw-text-orange-500 tw-bg-orange-50 tw-p-2 tw-rounded">Period is not opened. Go back current period</span>
                        )}
                        <button disabled={index === periods.length - 1} onClick={goNext} className="disabled:tw-bg-slate-200 tw-p-1 tw-shadow-lg tw-bg-orange-500 tw-text-white tw-rounded"><FiChevronRight size="26" /></button>
                    </div>
                </div>
                {period && (
                    <table className='tw-w-full tw-table'>
                        <thead>
                            <tr>
                                {dates.map((d, i) => {
                                    return (
                                        <th key={i} className="tw-h-10 tw-justify-center tw-items-center">
                                            <div className="tw-flex tw-flex-col">
                                                <span className="tw-text-orange-500 tw-font-bold tw-uppercase">{dayjs(d).format('ddd')}</span>
                                                <small className="tw-text-orange-500/50">{dayjs(d).format('DD-MMM-YYYY')}</small>
                                            </div>
                                        </th>
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
                                            {period.isCurrentPeriod ? (
                                                <div className="tw-h-16 tw-flex tw-items-center tw-justify-center tw-transition-all">
                                                    {booking
                                                        ? (
                                                            <button onClick={() => cancelBooking(period.id, booking.bookingId)} className="tw-text-green-500 hover:tw-cursor-pointer hover:tw-ring-2 active:tw-ring-offset-2 tw-ring-green-500 tw-rounded-full tw-transition-all">
                                                                <IoCheckmarkCircle size={40} />
                                                            </button>
                                                        )
                                                        : (
                                                            <button onClick={() => createBooking(period.id, date)} className="tw-text-slate-200 hover:tw-cursor-pointer hover:tw-ring-2 active:tw-ring-offset-2 tw-ring-slate-200 tw-rounded-full tw-transition-all">
                                                                <IoCheckmarkCircle size={40} />
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            ) : (
                                                <div className="tw-h-16 tw-flex tw-items-center tw-justify-center tw-transition-all">
                                                    <span className={cn({ "tw-text-orange-500": booking, "tw-text-slate-200": !booking })}><IoLockClosedSharp size={40} /></span>
                                                </div>
                                            )}
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