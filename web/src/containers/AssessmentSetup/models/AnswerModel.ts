export class AnswerModel {
    id?: number
    description: string = ''
    photoUrl?: string
    questionId?: number

    // If user select this answer, trigger the next question if this is set
    triggerQuestionId?: number
}