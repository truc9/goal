import AssessmentModel from '../containers/HSE/models/AssessmentModel'
import httpClient from './httpClient'

async function create(name: string, description: string) {
    await httpClient.post('assessments', {
        name,
        description
    })
}

async function get(): Promise<AssessmentModel[]> {
    const result = await httpClient.get<AssessmentModel[]>('assessments')
    return result
}

async function deleteById(id: number): Promise<void> {
    await httpClient.remove(`assessments/${id}`)
}

export default {
    get,
    create,
    deleteById
}