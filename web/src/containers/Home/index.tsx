import { useEffect, useState } from 'react'
import { FiBarChart2, FiCalendar, FiCheckCircle, FiGrid } from 'react-icons/fi'
import { Legend, Pie, PieChart, Tooltip } from 'recharts'
import { Card } from '../../components/Card'
import { ClickableCard } from '../../components/ClickableCard'
import { PageContainer } from '../../components/PageContainer'
import { NotificationEvents } from '../../constant'
import { AsyncContent } from '../../components/AsyncContent'
import { useQuery } from '@tanstack/react-query'
import useLocalAuth from '../../hooks/useLocalAuth'
import useWebSocket from '../../hooks/useWebSocket'
import httpClient from '../../services/httpClient'
import dateTimeUtil from '../../utils/datetimeUtil'

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
	const [loadingBookingStat, setLoadingBookingStat] = useState(false)

	const assignmentQuery = useQuery({
		queryKey: ['assignmentCount'],
		queryFn: () => httpClient.get<number>('stats/my-assignments/count')
	})

	socket.handleEvent(NotificationEvents.BookingUpdated, (data) => {
		setLoadingBookingStat(true)
		const { total, booked, unbooked } = data.payload.stat
		setData({ total, booked, unbooked })
		setLoadingBookingStat(false)
	})

	useEffect(() => {
		loadBookingStat()
	}, [])

	useEffect(() => {
		setTotalEmployee(data.total)
		setStats([
			{ name: 'Booked', value: data.booked, fill: '#2dd4bf' },
			{ name: 'Unbooked', value: data.unbooked, fill: '#fb7185' }
		])
	}, [data])

	const loadBookingStat = async () => {
		setLoadingBookingStat(true)
		const { booked, unbooked, total } = await httpClient.get('stats/booking-overall')
		setData({ total, booked, unbooked })
		setLoadingBookingStat(false)
	}

	return (
		<PageContainer
			icon={<FiGrid />}
			title='Dashboard'
			action={
				<span className='text-xl'>
					{dateTimeUtil.greeting()}, <span className='font-bold'>{user.name}</span> !
				</span>
			}>
			<div className='grid grid-cols-3 gap-5'>
				<ClickableCard
					title='My Booking'
					subTitle='Booking Office Visit'
					icon={<FiCheckCircle size={30} />}
					link='/my-booking'
				/>
				<ClickableCard
					disabled={user.role !== 'admin'}
					title='Booking Overview'
					subTitle='Manage Employee Bookings'
					icon={<FiBarChart2 size={30} />}
					link='/dashboard/booking-overview'
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
				<Card title='My Assignment'>
					<AsyncContent loading={assignmentQuery.isLoading}>
						<h3 className='text-8xl'>{assignmentQuery.data}</h3>
					</AsyncContent>
				</Card>
				<Card title='Total Employee'>
					<AsyncContent loading={loadingBookingStat}>
						<h3 className='text-8xl'>{totalEmployee}</h3>
					</AsyncContent>
				</Card>
				<Card title='Booking Overall Status'>
					<div>
						<AsyncContent loading={loadingBookingStat}>
							<PieChart width={300} height={300}>
								<Pie dataKey='value' isAnimationActive={false} data={stats} outerRadius={90} label />
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
