import { FiBarChart2, FiCalendar, FiCheckCircle, FiGrid } from "react-icons/fi"
import { PageContainer } from "../../components/PageContainer"
import { ClickableCard } from "./ClickableCard"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useLocalAuth } from "../../context/AuthContext"
import { Card } from "../../components/Card"
import { useEffect, useState } from "react"
import httpService from "../../services/httpService"
ChartJS.register(ArcElement, Tooltip, Legend)

const Home = () => {
    const { user } = useLocalAuth()
    const [bookingStats, setBookingStats] = useState<number[]>([])

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        const { booked, unbooked } = await httpService.get('stats/booking-overall')
        setBookingStats([booked, unbooked])
    }

    return (
        <PageContainer icon={<FiGrid size={26} />} title="Apps">
            <div className="tw-grid tw-grid-cols-3 tw-gap-5">
                <ClickableCard title="My Booking" subTitle="Booking Office Visit" icon={<FiCheckCircle size={30} />} link="/my-booking" />
                <ClickableCard disabled={user.role !== 'admin'} title="Booking Dashboard" subTitle="Manage Employee Bookings" icon={<FiBarChart2 size={30} />} link="/booking-dashboard" />
                <ClickableCard disabled={user.role !== 'admin'} title="Booking Periods" subTitle="Open Booking Periods" icon={<FiCalendar size={30} />} link="/booking-periods" />
            </div>
            <div className="tw-grid tw-grid-cols-3 tw-gap-5 tw-mt-3">
                <Card title="Booking Overall Status">
                    <div>
                        <Pie data={{
                            labels: ['Booked', 'Unbooked'],
                            datasets: [
                                {
                                    label: 'Count',
                                    data: bookingStats,
                                    backgroundColor: [
                                        'rgba(66, 245, 117, 1)',
                                        'rgba(245, 170, 66, 1)',
                                    ],
                                    borderWidth: 1,
                                },
                            ],
                        }} />
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}

export default Home
