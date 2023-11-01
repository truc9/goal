import { QuestionModel } from "../containers/AssessmentSetup/models/QuestionModel"
import { QuestionOrdinalModel } from "../containers/AssessmentSetup/models/QuestionOrdinalModel"
import httpClient from "./httpClient"

async function getByVersion(versionId: number) {
    return await httpClient.get<QuestionModel[]>(`assessments/versions/${versionId}/questions`)
}

function create(question: QuestionModel) {
    return httpClient.post("assessments/questions", question)
}

function remove(id: number) {
    return httpClient.remove(`assessments/questions/${id}`)
}

function updateOrdinal(id: number, model: QuestionOrdinalModel) {
    return httpClient.put(`assessments/questions/${id}/ordinal`, model)
}

export default {
    getByVersion,
    remove,
    create,
    updateOrdinal
}