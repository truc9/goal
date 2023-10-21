import { create } from 'zustand'
import { TopbarSlice, createTopbarSlice } from './topbarSlice'
import { AssessmentSlice, createAssessmentSlice } from './assessmentSlice'
import { EmployeeSlice, createEmployeeSlice } from './employeeSlice'

const useBearStore = create<
    TopbarSlice &
    AssessmentSlice &
    EmployeeSlice
>()((...a) => ({
    ...createTopbarSlice(...a),
    ...createAssessmentSlice(...a),
    ...createEmployeeSlice(...a)
}))

export default useBearStore