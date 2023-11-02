export enum QuestionType {
    FreeText = 0,
    YesNo = 1,
    YesNoNA = 2,
    Confirmation = 3,
    Photo = 4,
    SingleChoice = 5,
    MultipleChoice = 6,
}

export interface QuestionModel {
    id?: number
    ordinal: number
    description: string
    type: QuestionType
    choices?: ChoiceAnswer[]
    assessmentVersionId: number
}

export interface AnswerSubmissionModel {
    questionId: number
    text?: string
    yesNo?: boolean
    yesNoNa?: 'yes' | 'no' | 'na'
    confirmation?: boolean
    singleChoice?: number
    multipleChoices?: number[]
    photo?: string //URL
}

export interface ChoiceAnswer {
    uid?: string
    id?: number
    description: string
}