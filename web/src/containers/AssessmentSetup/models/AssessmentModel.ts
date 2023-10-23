import { AssessmentVersionModel } from "./AssessmentVersionModel"

export class AssessmentModel {
    id?: number
    name: string = ''
    description: string = ''
    versions: AssessmentVersionModel[] = []
}
