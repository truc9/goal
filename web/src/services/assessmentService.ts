import { AssessmentModel } from '../containers/AssessmentSetup/models/AssessmentModel'
import { AssessmentVersionModel } from '../containers/AssessmentSetup/models/AssessmentVersionModel'
import { PairItem } from '../models/pairItem'
import httpClient from './httpClient'

function create(name: string, description: string) {
    httpClient.post('assessments', {
        name,
        description
    })
}

function update(id: number, model: AssessmentModel) {
    httpClient.put(`assessments/${id}`, model)
}

function getAssessments(): Promise<AssessmentModel[]> {
    return httpClient.get<AssessmentModel[]>('assessments')
}

function getAssessmentPairItems(): Promise<PairItem[]> {
    return httpClient.get<PairItem[]>("assessments/pair-items")
}

function getVersions(assessmentId: number) {
    return httpClient.get<AssessmentVersionModel[]>(`assessments/${assessmentId}/versions`)
}

function deleteById(id: number) {
    return httpClient.remove(`assessments/${id}`)
}

function assign(userId: number, versionId: number) {
    httpClient.put(`assignments/${versionId}/assign`, { userId })
}

function unassign(userId: number, versionId: number) {
    httpClient.put(`assignments/${versionId}/unassign`, { userId })
}

export default {
    create,
    update,
    getAssessments,
    getAssessmentPairItems,
    getVersions,
    deleteById,
    assign,
    unassign,
}
