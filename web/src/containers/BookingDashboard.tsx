import { FiBarChart2 } from "react-icons/fi"
import dayjs from "dayjs"
import { PageContainer } from "../components/PageContainer"
import { useEffect, useState } from "react"
import bookingService from "../services/bookingService"
import { BookingPeriod, UserBooking } from "../services/models/booking"
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from "react-icons/io5"

const BookingDashboard: React.FC = () => {
    const [userBookings, setUserBookings] = useState<UserBooking[]>([])
    const [dates, setDates] = useState<Date[]>([])
    const [currentPeriod, setCurrentPeriod] = useState<BookingPeriod>()

    useEffect(() => {
        loadCurrentPeriod()
    }, [])

    useEffect(() => {
        if (currentPeriod) {
            const days = Array.from(Array(7).keys()).map(d => dayjs(currentPeriod.from).add(d, 'day'))
            setDates(days.map(dd => dd.toDate()))
            loadBookings()
        }
    }, [currentPeriod])

    const loadCurrentPeriod = async () => {
        const period = await bookingService.getCurrentPeriod()
        setCurrentPeriod(period)
    }

    const loadBookings = async () => {
        if (currentPeriod) {
            const res = await bookingService.getAllBookings(currentPeriod.id)
            setUserBookings(res)
        }
    }

    return (
        <PageContainer icon={<FiBarChart2 size="26" />} title="Booking Dashboard">
            <div className="tw-flex tw-items-center tw-content-center tw-text-center tw-text-2xl tw-justify-center tw-mb-5">
                <h3>{dayjs(currentPeriod?.from).format('ddd DD MMM YYYY')} - {dayjs(currentPeriod?.to).format('ddd DD MMM YYYY')}</h3>
            </div>
            <table className='tw-w-full tw-table'>
                <thead>
                    <tr>
                        <th className="tw-w-[100px]"></th>
                        {dates.map((d, i) => {
                            return (
                                <th key={i} className="tw-w-[130px] tw-h-10 tw-bg-slate-100 tw-justify-center tw-items-center">{dayjs(d).format('ddd')}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {userBookings.map((ub: UserBooking, idx: number) => {
                        return (
                            <tr className="tw-table-row tw-border hover:tw-bg-green-50" key={idx}>
                                <td className="tw-bg-slate-100">
                                    <span className="tw-justify-start tw-pl-5 tw-items-center tw-flex">{ub.userDisplayName}</span>
                                </td>
                                {dates.map((date, i) => {
                                    const booking = ub.bookings.find(bd => dayjs(bd.bookingDate).date() == dayjs(date).date())
                                    return (
                                        <td key={i} className="tw-p-2">
                                            {booking ? (
                                                <span className="tw-text-emerald-500 tw-justify-center tw-items-center tw-flex">
                                                    <IoCheckmarkCircle size="26" />
                                                </span>
                                            ) : (
                                                <span className="tw-text-orange-200 tw-justify-center tw-items-center tw-flex">
                                                    <IoCheckmarkCircleOutline size="26" />
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