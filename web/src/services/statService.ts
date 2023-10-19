import httpClient from "./httpClient"

async function getBookingPerPeriodsStats() {
    return await httpClient.get('stats/booking-per-periods')
}

export default {
    getBookingPerPeriodsStats
}