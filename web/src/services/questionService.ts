import { QuestionModel } from "../containers/HSE/models/QuestionModel"
import httpClient from "./httpClient"

async function getByAssessmentVersion(versionId: number) {
    const result = await httpClient.get<QuestionModel[]>(`assessments/versions/${versionId}/questions`)
    return result
}

async function create(question: QuestionModel) {
    await httpClient.post("assessments/questions", question)
}

export default {
    getByAssessmentVersion,
    create
}