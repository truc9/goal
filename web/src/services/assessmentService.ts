import { AssessmentModel } from '../models/assessment'
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

export default {
    get,
    create
}