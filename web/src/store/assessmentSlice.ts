import { StateCreator } from 'zustand'
import { AssessmentModel } from "../containers/AssessmentSetup/models/AssessmentModel"

export interface AssessmentSlice {
    assessments: AssessmentModel[]
    addAssessment: (assessment: AssessmentModel) => void
}

export const createAssessmentSlice: StateCreator<AssessmentSlice> = (set) => ({
    assessments: [],
    addAssessment: (assessment: AssessmentModel) => set((state) => ({
        assessments: [...state.assessments, assessment]
    }))
})
