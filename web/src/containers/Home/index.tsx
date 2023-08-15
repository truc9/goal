import { FiBarChart2, FiCalendar, FiCheckCircle, FiGrid } from "react-icons/fi"
import { PageContainer } from "../../components/PageContainer"
import { ClickableCard } from "./ClickableCard"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useLocalAuth } from "../../context/AuthContext"
import { Card } from "../../components/Card"
ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
    labels: ['Booked', 'Unbooked'],
    datasets: [
        {
            label: 'Number of Employee',
            data: [12, 19],
            backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
}


const Home = () => {
    const { user } = useLocalAuth()

    return (
        <PageContainer icon={<FiGrid size={26} />} title="Apps">
            <div className="tw-grid tw-grid-cols-3 tw-gap-5">
                <ClickableCard title="My Booking" subTitle="Booking Office Visit" icon={<FiCheckCircle size={30} />} link="/my-booking" />
                <ClickableCard disabled={user.role !== 'admin'} title="Booking Dashboard" subTitle="Manage Employee Bookings" icon={<FiBarChart2 size={30} />} link="/booking-dashboard" />
                <ClickableCard disabled={user.role !== 'admin'} title="Booking Periods" subTitle="Open Booking Periods" icon={<FiCalendar size={30} />} link="/booking-periods" />
            </div>
            <div className="tw-grid tw-grid-cols-3 tw-gap-5">
                <Card title="Booking Overall Status">
                    <div>
                        <Pie data={data} />
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}

export default Home