type EventType =
    | 'booking_updated'
    | 'user_joined'

export interface Notification<T = any> {
    event: EventType
    payload: T
}
