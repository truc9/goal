import { QuestionModel } from "./QuestionModel"

export class AssessmentVersionModel {
    id?: number
    version: number = 1
    questions: QuestionModel[] = []

    get questionCount(): number {
        return this.questions.length
    }
}