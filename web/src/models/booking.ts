export interface BookingPeriod {
    id: number
    from: Date
    to: Date
    isCurrentPeriod: boolean
}

export interface Booking {
    id: number
    userId: string
    date: Date
}

export interface UserBookingItem {
    bookingId: number
    bookingPeriodId: number
    userDisplayName: string
    bookingDate: string
}

export interface UserBooking {
    userDisplayName: string
    bookings: UserBookingItem[]
}