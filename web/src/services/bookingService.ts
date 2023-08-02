import { Booking, BookingPeriod } from "./models/booking"
import httpService from "./httpService"
import dayjs from "dayjs"

const getPeriods = async (): Promise<BookingPeriod[]> => {
    const periods = await httpService.get<BookingPeriod[]>('periods')
    const now = dayjs(new Date())
    const res = periods.map(p => ({ ...p, isCurrentWeek: now.isAfter(p.from) && now.isBefore(p.to) }))
    return res
}

const loadNextPeriod = async () => {
    await httpService.post('periods')
}

const submitBooking = async (bookingPeriodId: string, date: Date) => {
    await httpService.post('bookings', {
        date,
        bookingPeriodId
    })
}

const cancelBooking = async (bookingId: string) => {
    await httpService.remove(`bookings/${bookingId}`)
}

const getUserBookingsByBookingPeriod = async (bookingPeriodId: string): Promise<Booking[]> => {
    const res = await httpService.get<Booking[]>(`periods/${bookingPeriodId}/bookings`)
    return res
}

export default {
    getPeriods,
    loadNextPeriod,
    submitBooking,
    cancelBooking,
    getUserBookingsByBookingPeriod,
}