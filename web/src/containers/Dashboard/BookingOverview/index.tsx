import { useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { FiBarChart2, FiGrid } from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'

import { PageContainer } from '../../../components/PageContainer'
import { NotificationEvents } from '../../../constant'
import useWebSocket from '../../../hooks/useWebSocket'
import { BookingPeriod, UserBooking } from '../../../models/booking'
import { BookingPerPeriodStat } from '../../../models/stats'
import bookingService from '../../../services/bookingService'
import statService from '../../../services/statService'
import { CartesianGrid, Tooltip, XAxis, YAxis, AreaChart, Area, ResponsiveContainer } from 'recharts'
import { AsyncContent } from '../../../components/AsyncContent'
import { LoadingSkeleton } from '../../../components/LoadingSkeleton'
import dateTimeUtil from '../../../utils/datetimeUtil'

const BookingOverview: React.FC = () => {
	const [userBookings, setUserBookings] = useState<UserBooking[]>([])
	const [dates, setDates] = useState<Date[]>([])
	const [nextPeriod, setNextPeriod] = useState<BookingPeriod>()
	const [title, setTitle] = useState('')
	const [periodBookings, setPeriodBookings] = useState<BookingPerPeriodStat[]>([])
	const [loadingBookingPerPeriods, setLoadingPerPeriods] = useState(false)
	const [loadingAllBookings, setLoadingAllBookings] = useState(false)

	const socket = useWebSocket()

	socket.handleEvent(NotificationEvents.BookingUpdated, (data) => {
		setUserBookings(data.payload.bookings)
	})

	useEffect(() => {
		handleNextPeriod()
		loadLineChart()
	}, [])

	useEffect(() => {
		if (nextPeriod) {
			const days = Array.from(Array(7).keys()).map((d) => dayjs(nextPeriod.from).add(d, 'day'))
			setDates(days.map((dd) => dd.toDate()))
			loadBookingGrid()
			setTitle(`(${dateTimeUtil.format(nextPeriod?.from)} - ${dateTimeUtil.format(nextPeriod?.to)})`)
		}
	}, [nextPeriod])

	const handleNextPeriod = async () => {
		const period = await bookingService.getNextPeriod()
		setNextPeriod(period)
	}

	const loadBookingGrid = async () => {
		if (nextPeriod) {
			setLoadingAllBookings(true)
			const res = await bookingService.getAllBookings(nextPeriod.id)
			setUserBookings(res)
			setLoadingAllBookings(false)
		}
	}

	const loadLineChart = async () => {
		setLoadingPerPeriods(true)
		const response = await statService.getBookingPerPeriodsStats()
		setPeriodBookings(response)
		setLoadingPerPeriods(false)
	}

	return (
		<div>
			<PageContainer icon={<FiBarChart2 />} title='Booking By Period'>
				<div className='mb-3 w-full'>
					<AsyncContent loading={loadingBookingPerPeriods}>
						<ResponsiveContainer width='100%' height={300}>
							<AreaChart
								data={periodBookings}
								margin={{
									top: 10,
									right: 0,
									left: 0,
									bottom: 0
								}}>
								<defs>
									<linearGradient id='colorTotal' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
										<stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
									</linearGradient>
								</defs>
								<XAxis dataKey='from' tickFormatter={(item) => dayjs(item).format('DD MMM YYYY')} />
								<YAxis />
								<CartesianGrid strokeDasharray='5 5' />
								<Tooltip />
								<Area
									type='monotone'
									dataKey='total'
									stroke='#82ca9d'
									fillOpacity={1}
									fill='url(#colorTotal)'
								/>
							</AreaChart>
						</ResponsiveContainer>
					</AsyncContent>
				</div>
			</PageContainer>
			<PageContainer icon={<FiGrid />} title={`Booking By Employee ${title}`}>
				{loadingAllBookings ? (
					<LoadingSkeleton number={3} />
				) : (
					<table className='table w-full'>
						<thead>
							<tr>
								<th className='w-[200px]'>Employee</th>
								{dates.map((d) => {
									return (
										<th key={d.getDate()} className='h-10 w-[130px] items-center justify-center'>
											{dayjs(d).format('ddd')}
										</th>
									)
								})}
							</tr>
						</thead>
						<tbody>
							{userBookings.map((ub: UserBooking, idx: number) => {
								return (
									<tr className='table-row border-b-2 border-dashed' key={idx}>
										<td>
											<span className='flex items-center justify-start px-5'>
												{ub.userDisplayName}
											</span>
										</td>
										{dates.map((date, i) => {
											const booking = ub.bookings.find(
												(bd) => dayjs(bd.bookingDate).date() == dayjs(date).date()
											)
											return (
												<td key={i} className='p-2'>
													{booking ? (
														<span className='flex items-center justify-center text-green-500'>
															<IoCheckmarkCircle size='40' />
														</span>
													) : (
														<span className='flex items-center justify-center text-slate-200'>
															<IoCheckmarkCircle size='40' />
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
				)}
			</PageContainer>
		</div>
	)
}

export default BookingOverview
