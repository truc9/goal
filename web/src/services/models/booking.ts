export interface BookingPeriod {
    id: string
    from: Date
    to: Date
    isCurrentWeek: boolean
}

export interface Booking {
    id: string
    userId: string
    date: Date
}