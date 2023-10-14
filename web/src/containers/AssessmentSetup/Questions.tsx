import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FiList, FiPlus, FiTrash } from "react-icons/fi"
import { QuestionPopup } from "./QuestionPopup"
import { QuestionModel } from "./models/QuestionModel"
import { QuestionTypeDict } from "../../constant"
import questionService from "../../services/questionService"
import useBeerStore from "../../store"
import { Loading } from "../../components/Loading"

const Questions = () => {
    const [loading, setLoading] = useState(false)
    const { versionId } = useParams()
    const store = useBeerStore()
    const [openQuestionPopup, setOpenQuestionPopup] = useState(false)

    useEffect(() => {
        loadQuestions()
    }, [versionId])

    async function loadQuestions() {
        setLoading(true)
        const questions = await questionService.getByVersion(+versionId!)
        store.loadQuestions(questions)
        setLoading(false)
    }

    async function handleSubmitQuestion(question: QuestionModel) {
        setOpenQuestionPopup(false)
        await questionService.create(question)
        await loadQuestions()
    }

    async function handleDeleteQuestion(question: QuestionModel) {
        await questionService.remove(question.id!)
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
                        {loading
                            ? <div className="tw-p-5"><Loading /></div>
                            : store.currentVersion?.questions?.map((q, index) => {
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
                                            <div className="tw-w-40 tw-flex tw-items-center tw-justify-between tw-gap-5">
                                                {QuestionTypeDict[q.type]}
                                                <button onClick={() => handleDeleteQuestion(q)}><FiTrash /></button>
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