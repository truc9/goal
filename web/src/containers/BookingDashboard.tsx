import { FiBarChart2 } from "react-icons/fi"
import { PageContainer } from "../components/PageContainer"
import { useEffect, useState } from "react"
import bookingService from "../services/bookingService"
import { Booking } from "../services/models/booking"

const BookingDashboard: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([])

    useEffect(() => {
        loadBookings()
    }, [])

    const loadBookings = async () => {
        const period = await bookingService.getCurrentPeriod()
        const res = await bookingService.getAllBookings(period.id)
        setBookings(res)
        console.log(bookings)
    }

    return (
        <PageContainer icon={<FiBarChart2 size="26" />} title="Booking Dashboard">

        </PageContainer>
    )
}

export default BookingDashboard