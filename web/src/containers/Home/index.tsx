import { useEffect, useState } from 'react'

import { FiBarChart2, FiCalendar, FiCheckCircle, FiGrid } from 'react-icons/fi'
import { Legend, Pie, PieChart, Tooltip } from 'recharts'

import { Card } from '../../components/Card'
import { ClickableCard } from '../../components/ClickableCard'
import { PageContainer } from '../../components/PageContainer'
import { NotificationEvents } from '../../constant'
import useLocalAuth from '../../hooks/useLocalAuth'
import useWebSocket from '../../hooks/useWebSocket'
import httpService from '../../services/httpClient'
import { AsyncContent } from '../../components/AsyncContent'

const Home = () => {
	const [totalEmployee, setTotalEmployee] = useState(0)
	const [stats, setStats] = useState<any[]>([])
	const [data, setData] = useState<{
		total: number
		booked: number
		unbooked: number
	}>({ total: 0, unbooked: 0, booked: 0 })
	const { user } = useLocalAuth()
	const socket = useWebSocket()
	const [isLoading, setIsLoading] = useState(true)

	socket.handleEvent(NotificationEvents.BookingUpdated, (data) => {
		setIsLoading(true)
		console.log(
			`${new Date()} dashboard updated with data ${JSON.stringify(data)}`
		)
		const { total, booked, unbooked } = data.payload.stat
		setData({ total, booked, unbooked })
		setIsLoading(false)
	})

	useEffect(() => {
		handleLoad()
	}, [])

	useEffect(() => {
		setTotalEmployee(data.total)
		setStats([
			{ name: 'Booked', value: data.booked, fill: '#2dd4bf' },
			{ name: 'Unbooked', value: data.unbooked, fill: '#fb7185' }
		])
	}, [data])

	const handleLoad = async () => {
		const { booked, unbooked, total } = await httpService.get(
			'stats/booking-overall'
		)
		setData({ total, booked, unbooked })
		setIsLoading(false)
	}

	return (
		<PageContainer icon={<FiGrid />} title='Apps'>
			<div className='grid grid-cols-3 gap-5'>
				<ClickableCard
					title='My Booking'
					subTitle='Booking Office Visit'
					icon={<FiCheckCircle size={30} />}
					link='/my-booking'
				/>
				<ClickableCard
					disabled={user.role !== 'admin'}
					title='Booking Dashboard'
					subTitle='Manage Employee Bookings'
					icon={<FiBarChart2 size={30} />}
					link='/booking-dashboard'
				/>
				<ClickableCard
					disabled={user.role !== 'admin'}
					title='Booking Periods'
					subTitle='Open Booking Periods'
					icon={<FiCalendar size={30} />}
					link='/booking-periods'
				/>
			</div>
			<div className='mt-3 grid grid-cols-3 gap-5'>
				<Card title='Total Employee'>
					{isLoading}
					<AsyncContent loading={isLoading}>
						<h3 className='text-8xl'>{totalEmployee}</h3>
					</AsyncContent>
				</Card>
				<Card title='Booking Overall Status'>
					<div>
						<AsyncContent loading={isLoading}>
							<PieChart width={300} height={300}>
								<Pie
									dataKey='value'
									isAnimationActive={false}
									data={stats}
									outerRadius={90}
									label
								/>
								<Tooltip />
								<Legend verticalAlign='top' height={36} />
							</PieChart>
						</AsyncContent>
					</div>
				</Card>
			</div>
		</PageContainer>
	)
}

export default Home
