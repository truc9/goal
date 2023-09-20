import { FiBarChart2 } from "react-icons/fi"
import dayjs from "dayjs"
import { PageContainer } from "../../components/PageContainer"
import { useEffect, useState } from "react"
import bookingService from "../../services/bookingService"
import { BookingPeriod, UserBooking } from "../../models/booking"
import { IoCheckmarkCircle } from "react-icons/io5"
import useWebSocket from "../../hooks/useWebSocket"
import { NotificationEvents } from "../../constant"

const BookingDashboard: React.FC = () => {
    const [userBookings, setUserBookings] = useState<UserBooking[]>([])
    const [dates, setDates] = useState<Date[]>([])
    const [nextPeriod, setNextPeriod] = useState<BookingPeriod>()
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
        <PageContainer icon={<FiBarChart2 size="26" />} title="Booking Dashboard">
            <div className="tw-flex tw-items-center tw-content-center tw-text-center tw-text-xl tw-font-bold tw-text-emerald-500 tw-justify-center tw-mb-5">
                <h3>{dayjs(nextPeriod?.from).format('DD MMM YYYY')} - {dayjs(nextPeriod?.to).format('DD MMM YYYY')}</h3>
            </div>
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
                            <tr className="tw-table-row odd:tw-bg-slate-100" key={idx}>
                                <td>
                                    <span className="tw-justify-start tw-px-5 tw-items-center tw-flex">{ub.userDisplayName}</span>
                                </td>
                                {dates.map((date, i) => {
                                    const booking = ub.bookings.find(bd => dayjs(bd.bookingDate).date() == dayjs(date).date())
                                    return (
                                        <td key={i} className="tw-p-1">
                                            {booking ? (
                                                <span className="tw-text-emerald-500 tw-justify-center tw-items-center tw-flex">
                                                    <IoCheckmarkCircle size="30" />
                                                </span>
                                            ) : (
                                                <span className="tw-text-slate-200 tw-justify-center tw-items-center tw-flex">
                                                    <IoCheckmarkCircle size="30" />
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
