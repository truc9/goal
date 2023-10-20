import { EmployeeModel } from "../models/employee"
import httpClient from "./httpClient"

async function getAll() {
    const data = await httpClient.get<EmployeeModel[]>('employees')
    return data
}

async function allocateEmployeeNumber(userId: number) {
    await httpClient.put(`users/${userId}/allocate-employee-number`, {})
}

export default {
    getAll,
    allocateEmployeeNumber
}