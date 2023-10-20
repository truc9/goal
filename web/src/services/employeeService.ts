import { EmployeeModel } from "../models/employee"
import httpClient from "./httpClient"

async function getAll() {
    const data = await httpClient.get<EmployeeModel[]>('employees')
    return data
}

async function allocateEmployeeNumber(userId: number) {
    await httpClient.put(`employees/${userId}/employee-numbers`, {})
}

async function activate(userId: number) {
    await httpClient.put(`employees/${userId}/activate`, {})
}

async function deactivate(userId: number) {
    await httpClient.put(`employees/${userId}/deactivate`, {})
}

export default {
    getAll,
    activate,
    deactivate,
    allocateEmployeeNumber
}