import AssessmentModel from '../containers/HSE/models/AssessmentModel'
import { AssessmentVersionModel } from '../containers/HSE/models/AssessmentVersionModel'
import httpClient from './httpClient'

async function create(name: string, description: string) {
    await httpClient.post('assessments', {
        name,
        description
    })
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
    getAll,
    getVersions,
    deleteById
}