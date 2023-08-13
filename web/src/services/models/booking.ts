export interface BookingPeriod {
    id: string
    from: Date
    to: Date
    isCurrentPeriod: boolean
}

export interface Booking {
    id: string
    userId: string
    date: Date
}

export interface UserBookingItem {
    bookingId: string
    bookingPeriodId: string
    userDisplayName: string
    bookingDate: string
}

export interface UserBooking {
    userDisplayName: string
    bookings: UserBookingItem[]
}