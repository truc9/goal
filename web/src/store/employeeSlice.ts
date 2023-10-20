import { StateCreator } from "zustand"
import { EmployeeModel } from "../models/employee"
import { produce } from "immer"

export interface EmployeeSlice {
    employees: EmployeeModel[]
    loadEmployees: (employees: EmployeeModel[]) => void
}

export const createEmployeeSlice: StateCreator<EmployeeSlice> = (set) => ({
    employees: [],
    loadEmployees: (employees: EmployeeModel[]) => set((state) => {
        return produce(state, draft => {
            draft.employees = employees
        })
    })
})