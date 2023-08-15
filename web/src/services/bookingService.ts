import { Booking, BookingPeriod } from "./models/booking"
import httpService from "./httpService"
import dayjs from "dayjs"

const getPeriods = async (): Promise<BookingPeriod[]> => {
    const periods = await httpService.get<BookingPeriod[]>('periods')
    const now = dayjs(new Date())
    const res = periods.map(p => ({ ...p, isCurrentWeek: now.isAfter(p.from) && now.isBefore(p.to) }))
    return res
}

const getNextPeriod = async (): Promise<BookingPeriod> => {
    const period = await httpService.get<BookingPeriod>('periods/next')
    return period
}

const createNextPeriod = async () => {
    await httpService.post('periods')
}

const createBooking = async (bookingPeriodId: string, date: Date) => {
    await httpService.post('bookings', {
        date,
        bookingPeriodId
    })
}

const deleteBooking = async (bookingId: string) => {
    await httpService.remove(`bookings/${bookingId}`)
}

const getMyBookings = async (periodId: string): Promise<Booking[]> => {
    const res = await httpService.get<Booking[]>(`periods/${periodId}/my-bookings`)
    return res
}

const getAllBookings = async (periodId: string): Promise<any[]> => {
    const res = await httpService.get<any[]>(`periods/${periodId}/bookings`)
    return res
}

export default {
    getPeriods,
    createNextPeriod,
    getNextPeriod,
    createBooking,
    deleteBooking,
    getMyBookings,
    getAllBookings
}