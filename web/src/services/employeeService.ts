import { AssignmentModel } from "../containers/AssessmentSetup/models/AssignmentModel"
import { EmployeeModel, EmployeeResponse } from "../models/employee"
import httpClient from "./httpClient"

async function getAll() {
    const data = await httpClient.get<EmployeeModel[]>('employees')
    return data
}

async function allocateEmployeeNumber(userId: number) {
    await httpClient.put(`employees/${userId}/employee-numbers`, {})
}

async function activate(userId: number): Promise<EmployeeResponse> {
    return await httpClient.put(`employees/${userId}/activate`, {})
}

async function deactivate(userId: number): Promise<EmployeeResponse> {
    return await httpClient.put(`employees/${userId}/deactivate`, {})
}

async function upload(file: File) {
    const form = new FormData()
    form.append("file", file)
    return await httpClient.post('employees/import', form)
}

const getAssignments = async (userId: number) => {
    return await httpClient.get<AssignmentModel[]>(`employees/${userId}/assignments`)
}

export default {
    getAll,
    activate,
    deactivate,
    upload,
    allocateEmployeeNumber,
    getAssignments
}