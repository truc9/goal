import { FiBarChart2, FiCalendar, FiCheckCircle, FiGrid } from "react-icons/fi"
import { PageContainer } from "../../components/PageContainer"
import { ClickableCard } from "./ClickableCard"
import { useLocalAuth } from "../../context/AuthContext"
import { Card } from "../../components/Card"
import { useEffect, useState } from "react"
import httpService from "../../services/httpService"
import { PieChart, Pie, Tooltip, Legend } from 'recharts'

const Home = () => {
    const { user } = useLocalAuth()
    const [totalEmployee, setTotalEmployee] = useState(0)
    const [stats, setStats] = useState<any[]>([])

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        const { booked, unbooked, total } = await httpService.get('stats/booking-overall')
        setTotalEmployee(total)
        setStats([
            { name: 'Booked', value: booked, fill: "#22c55e" },
            { name: 'Unbooked', value: unbooked, fill: "#6366f1" },
        ])
    }

    return (
        <PageContainer icon={<FiGrid size={26} />} title="Apps">
            <div className="tw-grid tw-grid-cols-3 tw-gap-5">
                <ClickableCard title="My Booking" subTitle="Booking Office Visit" icon={<FiCheckCircle size={30} />} link="/my-booking" />
                <ClickableCard disabled={user.role !== 'admin'} title="Booking Dashboard" subTitle="Manage Employee Bookings" icon={<FiBarChart2 size={30} />} link="/booking-dashboard" />
                <ClickableCard disabled={user.role !== 'admin'} title="Booking Periods" subTitle="Open Booking Periods" icon={<FiCalendar size={30} />} link="/booking-periods" />
            </div>
            <div className="tw-grid tw-grid-cols-3 tw-gap-5 tw-mt-3">
                <Card title="Total Employee">
                    <h3 className="tw-text-8xl">{totalEmployee}</h3>
                </Card>
                <Card title="Booking Overall Status">
                    <div>
                        <PieChart width={300} height={300}>
                            <Pie
                                dataKey="value"
                                isAnimationActive={false}
                                data={stats}
                                outerRadius={90}
                                label
                            />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                        </PieChart>
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}

export default Home
