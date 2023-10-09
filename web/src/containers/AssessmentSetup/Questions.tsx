import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import questionService from "../../services/questionService"
import { FiList, FiPlus } from "react-icons/fi"
import { QuestionPopup } from "./QuestionPopup"
import { QuestionModel } from "./models/QuestionModel"
import { QuestionTypeDict } from "../../constant"

const Questions = () => {
    const { versionId } = useParams()
    const [questions, setQuestions] = useState<QuestionModel[]>([])
    const [openQuestionPopup, setOpenQuestionPopup] = useState(false)

    useEffect(() => {
        loadQuestions()
    }, [versionId])

    async function loadQuestions() {
        const questions = await questionService.getByAssessmentVersion(+versionId!)
        setQuestions(questions)
    }

    async function handleSubmitQuestion(question: QuestionModel) {
        await questionService.create(question)
        await loadQuestions()
    }

    return (
        <>
            <div className="tw-flex tw-flex-col tw-flex-1 tw-h-full tw-gap-3">
                <div className="tw-p-3 tw-flex tw-flex-col tw-gap-3 md:tw-w-full">
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <button className="btn-secondary" onClick={() => setOpenQuestionPopup(true)}><FiPlus /> Add Question</button>
                    </div>
                    <div className="tw-flex tw-flex-col tw-gap-1">
                        {questions.map((q, index) => {
                            return (
                                <div key={index}
                                    className="tw-flex tw-items-center tw-h-16 tw-gap-3 tw-bg-slate-100 tw-p-5 tw-rounded hover:tw-cursor-move">
                                    <div>
                                        <FiList />
                                    </div>
                                    <div className="tw-flex tw-justify-between tw-w-full">
                                        <div className="flex-1">
                                            {q.description}
                                        </div>
                                        <div className="tw-w-36">
                                            {QuestionTypeDict[q.type]}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div >
            </div >

            <QuestionPopup
                versionId={+versionId!}
                isOpen={openQuestionPopup}
                onClose={() => setOpenQuestionPopup(false)}
                onSubmit={handleSubmitQuestion}
            />
        </>
    )
}

export default Questions