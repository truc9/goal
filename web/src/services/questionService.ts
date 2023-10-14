import { QuestionModel } from "../containers/AssessmentSetup/models/QuestionModel"
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

export default {
    getByVersion,
    remove,
    create
}