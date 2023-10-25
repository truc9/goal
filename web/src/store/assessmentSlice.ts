import { StateCreator } from 'zustand'
import { produce } from 'immer'
import {
    AssessmentModel,
    AssessmentVersionModel,
    QuestionModel
} from '../containers/AssessmentSetup/models'

export interface AssessmentSlice {
    assessments: AssessmentModel[]
    currentAssessment: AssessmentModel
    loadCurrentAssessment: (model: AssessmentModel) => void

    currentVersion: AssessmentVersionModel
    loadCurrentVersion: (model: AssessmentVersionModel) => void
    loadQuestions: (questions: QuestionModel[]) => void

    loadAssessments: (arr: AssessmentModel[]) => void
    loadVersions: (arr: AssessmentVersionModel[]) => void

    addAssessment: (model: AssessmentModel) => void
    addVersion: (assessmentId: number, v: AssessmentVersionModel) => void
    addQuetion: (versionId: number, q: QuestionModel) => void
}

export const createAssessmentSlice: StateCreator<AssessmentSlice> = (set) => ({
    currentAssessment: new AssessmentModel(),
    currentVersion: new AssessmentVersionModel(),
    assessments: [],
    versions: [],
    loadAssessments: (arr: AssessmentModel[]) => set((state) => {
        return produce(state, draft => {
            draft.assessments = arr
        })
    }),
    loadCurrentAssessment: (model: AssessmentModel) => set((state) => {
        return produce(state, draft => {
            draft.currentAssessment = model
        })
    }),
    loadVersions: (arr: AssessmentVersionModel[]) => set((state) => {
        return produce(state, draft => {
            draft.currentAssessment.versions = arr
        })
    }),
    loadCurrentVersion: (model: AssessmentVersionModel) => set((state) => {
        return produce(state, draft => {
            draft.currentVersion = model
        })
    }),
    loadQuestions: (questions: QuestionModel[]) => set((state) => {
        return produce(state, draft => {
            draft.currentVersion.questions = questions
        })
    }),
    addAssessment: (model: AssessmentModel) => set((state) => {
        return produce(state, draft => {
            draft.assessments.push(model)
        })
    }),
    addVersion: (assessmentId: number, model: AssessmentVersionModel) => set((state) => {
        return produce(state, draft => {
            const assessment = draft.assessments.find(a => a.id === assessmentId)
            assessment?.versions.push(model)
        })
    }),
    addQuetion: (versionId: number, model: QuestionModel) => set((state) => {
        return produce(state, draft => {
            const version = draft.assessments.map(a => a.versions).flat().find(v => v.id === versionId)
            version?.questions.push(model)
        })
    }),
})
