import dayjs from 'dayjs'

import {
    Booking,
    BookingPeriod,
} from '../models/booking'
import httpClient from './httpClient'

const getPeriods = async (): Promise<BookingPeriod[]> => {
    const periods = await httpClient.get<BookingPeriod[]>('periods')
    const now = dayjs(new Date())
    const res = periods.map(p => ({ ...p, isCurrentWeek: now.isAfter(p.from) && now.isBefore(p.to) }))
    return res
}

const getNextPeriod = async (): Promise<BookingPeriod> => {
    const period = await httpClient.get<BookingPeriod>('periods/next')
    return period
}

const createNextPeriod = async () => {
    await httpClient.post('periods')
}

const createBooking = async (bookingPeriodId: number, date: Date) => {
    await httpClient.post('bookings', {
        date,
        bookingPeriodId
    })
}

const deleteBooking = async (bookingId: number) => {
    await httpClient.remove(`bookings/${bookingId}`)
}

const getMyBookings = async (periodId: number): Promise<Booking[]> => {
    const res = await httpClient.get<Booking[]>(`periods/${periodId}/my-bookings`)
    return res
}

const getAllBookings = async (periodId: number): Promise<any[]> => {
    const res = await httpClient.get<any[]>(`periods/${periodId}/bookings`)
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