import httpClient from "./httpClient"

async function getBookingPerPeriodsStats() {
    const response = await httpClient.get('stats/booking-per-periods')
    return response
}

export default {
    getBookingPerPeriodsStats
}