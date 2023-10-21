export interface EmployeeModel {
    id: number
    uid: string
    firstName: string
    lastName: string
    email: string
    employeeNumber: string
    createdDate: Date
    updatedDate: Date
    isActive: boolean
}

export interface EmployeeResponse {
    id: number
    firstName: string
    lastName: string
}