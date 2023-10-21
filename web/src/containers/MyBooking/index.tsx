import React, { useEffect, useState } from 'react'

import cn from 'classnames'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import {
	IoBookOutline,
	IoCheckmarkCircle,
	IoLockClosedSharp
} from 'react-icons/io5'

import { enqueueSnackbar } from 'notistack'

import { PageContainer } from '../../components/PageContainer'
import useWebSocket from '../../hooks/useWebSocket'
import { BookingPeriod } from '../../models/booking'
import bookingService from '../../services/bookingService'
import dateUtil from '../../utils/DateUtil'

dayjs.extend(weekday)

interface BookingDate {
	bookingId: number
	date: number
}

const MyBooking: React.FC = () => {
	const [periods, setPeriods] = useState<BookingPeriod[]>([])
	const [period, setPeriod] = useState<BookingPeriod>()
	const [dates, setDates] = useState<Date[]>([])
	const [bookings, setBookings] = useState<BookingDate[]>([])
	const [index, setIndex] = useState(0)

	const ws = useWebSocket()

	useEffect(() => {
		loadPeriods()
	}, [])

	useEffect(() => {
		if (period) {
			const days = Array.from(Array(7).keys()).map((d) =>
				dayjs(period.from).add(d, 'day')
			)
			setDates(days.map((dd) => dd.toDate()))
			load(period.id)
		}
	}, [period])

	useEffect(() => {
		if (index >= 0 && index <= periods.length - 1) {
			setPeriod(periods[index])
		}
	}, [index, periods])

	async function loadPeriods() {
		const periods = await bookingService.getPeriods()
		const currentPeriod = periods.find((p) => p.isCurrentPeriod)
		if (currentPeriod) {
			setPeriod(currentPeriod)
		}

		setPeriods(periods)

		const index = periods.findIndex((p) => p.isCurrentPeriod)
		setIndex(index)
	}

	const load = async (periodId: number) => {
		const bookings = await bookingService.getMyBookings(periodId)
		const dates = bookings.map((booking) => ({
			date: dayjs(booking.date).date(),
			bookingId: booking.id
		}))
		setBookings(dates)
	}

	const createBooking = async (periodId: number, d: Date) => {
		enqueueSnackbar(`Booked ${dateUtil.format(d)}`, { variant: 'success' })
		await bookingService.createBooking(periodId, d)
		await load(periodId)
		ws.send('booking_updated')
	}

	const cancelBooking = async (periodId: number, bookingId: number) => {
		enqueueSnackbar('Unbooked successfully')
		await bookingService.deleteBooking(bookingId)
		await load(periodId)
		ws.send('booking_updated')
	}

	const goNext = () => {
		if (index < periods.length - 1) {
			setIndex(index + 1)
		}
	}

	const goBack = () => {
		if (index > 0) {
			setIndex(index - 1)
		}
	}

	return (
		<PageContainer icon={<IoBookOutline />} title='My Booking'>
			<div className='tw-flex tw-flex-col tw-gap-5'>
				<div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3'>
					<div className='tw-flex tw-items-center tw-gap-1 tw-rounded tw-border tw-border-emerald-100 tw-bg-emerald-50 tw-px-1 tw-py-1'>
						<button
							disabled={index === 0}
							onClick={goBack}
							className='tw-rounded tw-bg-emerald-500 tw-p-1 tw-text-white tw-shadow-lg disabled:tw-bg-slate-200'>
							<FiChevronLeft size='26' />
						</button>
						{period ? (
							<span className='tw-flex tw-items-center tw-gap-3 tw-rounded tw-p-2 tw-text-emerald-500'>
								{dayjs(period?.from).format('DD MMM YYYY')} -{' '}
								{dayjs(period?.to).format('DD MMM YYYY')}
							</span>
						) : (
							<span className='tw-rounded tw-bg-emerald-50 tw-p-2 tw-text-emerald-500'>
								Period is not opened. Go back current period
							</span>
						)}
						<button
							disabled={index === periods.length - 1}
							onClick={goNext}
							className='tw-rounded tw-bg-emerald-500 tw-p-1 tw-text-white tw-shadow-lg disabled:tw-bg-slate-200'>
							<FiChevronRight size='26' />
						</button>
					</div>
				</div>
				{period && (
					<table className='tw-table tw-w-full'>
						<thead>
							<tr>
								{dates.map((d, i) => {
									return (
										<th
											key={i}
											className='tw-h-10 tw-items-center tw-justify-center'>
											<div className='tw-flex tw-flex-col'>
												<span className='tw-font-bold tw-uppercase tw-text-emerald-500'>
													{dayjs(d).format('ddd')}
												</span>
												<small className='tw-text-emerald-500/50'>
													{dayjs(d).format(
														'DD-MMM-YYYY'
													)}
												</small>
											</div>
										</th>
									)
								})}
							</tr>
						</thead>
						<tbody>
							<tr className='tw-table-row'>
								{dates.map((date, i) => {
									const booking = bookings.find(
										(bd) => bd.date == dayjs(date).date()
									)
									return (
										<td key={i}>
											{period.isCurrentPeriod ? (
												<div className='tw-flex tw-h-16 tw-items-center tw-justify-center tw-transition-all'>
													{booking ? (
														<button
															onClick={() =>
																cancelBooking(
																	period.id,
																	booking.bookingId
																)
															}
															className='tw-rounded-full tw-text-green-500 tw-ring-green-500 tw-transition-all hover:tw-cursor-pointer hover:tw-ring-2 active:tw-ring-offset-2'>
															<IoCheckmarkCircle
																size={40}
															/>
														</button>
													) : (
														<button
															onClick={() =>
																createBooking(
																	period.id,
																	date
																)
															}
															className='tw-rounded-full tw-text-slate-200 tw-ring-slate-200 tw-transition-all hover:tw-cursor-pointer hover:tw-ring-2 active:tw-ring-offset-2'>
															<IoCheckmarkCircle
																size={40}
															/>
														</button>
													)}
												</div>
											) : (
												<div className='tw-flex tw-h-16 tw-items-center tw-justify-center tw-transition-all'>
													<span
														className={cn({
															'tw-text-emerald-500':
																booking,
															'tw-text-slate-200':
																!booking
														})}>
														<IoLockClosedSharp
															size={40}
														/>
													</span>
												</div>
											)}
										</td>
									)
								})}
							</tr>
						</tbody>
					</table>
				)}
			</div>
		</PageContainer>
	)
}

export default MyBooking
