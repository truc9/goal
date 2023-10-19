import { QuestionModel } from "../containers/AssessmentSetup/models/QuestionModel"
import { QuestionOrdinalModel } from "../containers/AssessmentSetup/models/QuestionOrdinalModel"
import httpClient from "./httpClient"

async function getByVersion(versionId: number) {
    const result = await httpClient.get<QuestionModel[]>(`assessments/versions/${versionId}/questions`)
    return result
}

async function create(question: QuestionModel) {
    await httpClient.post("assessments/questions", question)
}

async function remove(id: number) {
    await httpClient.remove(`assessments/questions/${id}`)
}

async function updateOrdinal(id: number, model: QuestionOrdinalModel) {
    await httpClient.put(`assessments/questions/${id}/ordinal`, model)
}

export default {
    getByVersion,
    remove,
    create,
    updateOrdinal
}