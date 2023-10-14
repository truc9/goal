import {
    useEffect,
    useState,
} from 'react'

import dayjs from 'dayjs'
import { FiBarChart2 } from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'

import { PageContainer } from '../../components/PageContainer'
import { NotificationEvents } from '../../constant'
import useWebSocket from '../../hooks/useWebSocket'
import {
    BookingPeriod,
    UserBooking,
} from '../../models/booking'
import bookingService from '../../services/bookingService'

const BookingDashboard: React.FC = () => {
    const [userBookings, setUserBookings] = useState<UserBooking[]>([])
    const [dates, setDates] = useState<Date[]>([])
    const [nextPeriod, setNextPeriod] = useState<BookingPeriod>()
    const [title, setTitle] = useState("")

    const socket = useWebSocket()

    socket.handleEvent(NotificationEvents.BookingUpdated, (data) => {
        setUserBookings(data.payload.bookings)
    })

    useEffect(() => {
        handleNextPeriod()
    }, [])

    useEffect(() => {
        if (nextPeriod) {
            const days = Array.from(Array(7).keys()).map(d => dayjs(nextPeriod.from).add(d, 'day'))
            setDates(days.map(dd => dd.toDate()))
            loadBookings()
            setTitle(`Booking ${dayjs(nextPeriod?.from).format('DD/MMM/YYYY')} to ${dayjs(nextPeriod?.to).format('DD/MMM/YYYY')}`)
        }
    }, [nextPeriod])

    const handleNextPeriod = async () => {
        const period = await bookingService.getNextPeriod()
        setNextPeriod(period)
    }

    const loadBookings = async () => {
        if (nextPeriod) {
            const res = await bookingService.getAllBookings(nextPeriod.id)
            setUserBookings(res)
        }
    }

    return (
        <PageContainer icon={<FiBarChart2 />} title={title}>
            <table className='tw-w-full tw-table'>
                <thead>
                    <tr>
                        <th className="tw-w-[200px]">Employee</th>
                        {dates.map((d, i) => {
                            return (
                                <th key={i} className="tw-w-[130px] tw-h-10 tw-justify-center tw-items-center">{dayjs(d).format('ddd')}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {userBookings.map((ub: UserBooking, idx: number) => {
                        return (
                            <tr className="tw-table-row" key={idx}>
                                <td>
                                    <span className="tw-justify-start tw-px-5 tw-items-center tw-flex">{ub.userDisplayName}</span>
                                </td>
                                {dates.map((date, i) => {
                                    const booking = ub.bookings.find(bd => dayjs(bd.bookingDate).date() == dayjs(date).date())
                                    return (
                                        <td key={i} className="tw-p-2">
                                            {booking ? (
                                                <span className="tw-text-green-500 tw-justify-center tw-items-center tw-flex">
                                                    <IoCheckmarkCircle size="40" />
                                                </span>
                                            ) : (
                                                <span className="tw-text-slate-200 tw-justify-center tw-items-center tw-flex">
                                                    <IoCheckmarkCircle size="40" />
                                                </span>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </PageContainer>
    )
}

export default BookingDashboard
