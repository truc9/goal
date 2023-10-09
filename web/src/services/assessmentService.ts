import { AssessmentModel } from '../containers/AssessmentSetup/models/AssessmentModel'
import { AssessmentVersionModel } from '../containers/AssessmentSetup/models/AssessmentVersionModel'
import httpClient from './httpClient'

async function create(name: string, description: string) {
    await httpClient.post('assessments', {
        name,
        description
    })
}

async function update(id: number, model: AssessmentModel) {
    await httpClient.put(`assessments/${id}`, model)
}

async function getAll(): Promise<AssessmentModel[]> {
    const result = await httpClient.get<AssessmentModel[]>('assessments')
    return result
}

async function getVersions(assessmentId: number) {
    const result = await httpClient.get<AssessmentVersionModel[]>(`assessments/${assessmentId}/versions`)
    return result
}

async function deleteById(id: number): Promise<void> {
    await httpClient.remove(`assessments/${id}`)
}

export default {
    create,
    update,
    getAll,
    getVersions,
    deleteById
}