import { BookingPeriod } from "./models/booking"
import httpService from "./httpService"

const getPeriods = async (): Promise<BookingPeriod[]> => {
    const res = await httpService.get<BookingPeriod[]>('periods')
    return res
}

const loadNextPeriod = async () => {
    await httpService.post('periods')
}

export default {
    getPeriods,
    loadNextPeriod
}