import { FiBarChart2, FiCalendar, FiCheckCircle, FiGrid } from "react-icons/fi"
import { PageContainer } from "../../components/PageContainer"
import { ClickableCard } from "../../components/ClickableCard"
import { Card } from "../../components/Card"
import { useEffect, useState } from "react"
import { PieChart, Pie, Tooltip, Legend } from 'recharts'
import httpService from "../../services/httpClient"
import useLocalAuth from "../../hooks/useLocalAuth"
import useWebSocket from "../../hooks/useWebSocket"
import { NotificationEvents } from "../../constant"

const Home = () => {
    const [totalEmployee, setTotalEmployee] = useState(0)
    const [stats, setStats] = useState<any[]>([])
    const [data, setData] = useState<{ total: number, booked: number, unbooked: number }>({ total: 0, unbooked: 0, booked: 0 })
    const { user } = useLocalAuth()
    const socket = useWebSocket()

    socket.handleEvent(NotificationEvents.BookingUpdated, (data) => {
        console.log(`${new Date()} dashboard updated with data ${JSON.stringify(data)}`)
        const { total, booked, unbooked } = data.payload.stat
        setData({ total, booked, unbooked })
    })

    useEffect(() => {
        handleLoad()
    }, [])

    useEffect(() => {
        setTotalEmployee(data.total)
        setStats([
            { name: 'Booked', value: data.booked, fill: "#2dd4bf" },
            { name: 'Unbooked', value: data.unbooked, fill: "#fb7185" },
        ])
    }, [data])

    const handleLoad = async () => {
        const { booked, unbooked, total } = await httpService.get('stats/booking-overall')
        setData({ total, booked, unbooked })
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
