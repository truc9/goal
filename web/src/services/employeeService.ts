import { EmployeeModel } from "../models/employee"
import httpClient from "./httpClient"

async function getAll() {
    const data = await httpClient.get<EmployeeModel[]>('employees')
    return data
}


export default {
    getAll
}