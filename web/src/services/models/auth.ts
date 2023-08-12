export interface RegistrationUser {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface AuthUser {
    name: string
    email: string
    role?: string
    expire: number
    token: string
}