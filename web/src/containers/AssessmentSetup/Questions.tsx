import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import questionService from "../../services/questionService"
import { FiPlus, FiXCircle } from "react-icons/fi"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { v4 as uuid_v4 } from 'uuid'
import { QuestionTypeDict } from "../../constant"
import { IconButton } from "@mui/material"
import { QuestionPopup } from "./QuestionPopup"
import { QuestionModel } from "./models/QuestionModel"

const Questions = () => {
    const { versionId } = useParams()
    const [questions, setQuestions] = useState<QuestionModel[]>([])
    const [openQuestionPopup, setOpenQuestionPopup] = useState(false)

    const questionColDefs: GridColDef[] = [
        { field: "description", headerName: "Question", width: 600 },
        {
            field: "type",
            headerName: "Type",
            width: 200,
            valueGetter: (params) => QuestionTypeDict[params.value]
        },
        {
            field: "id",
            headerName: "Delete",
            width: 100,
            renderCell: (e) => {
                return (
                    <IconButton onClick={() => deleteQuestion(e.value)}>
                        <FiXCircle className="tw-text-red-500" />
                    </IconButton>
                )
            }
        },
    ]

    async function deleteQuestion(questionId: number) {
        console.log(questionId)
    }

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
            <div className="tw-flex tw-flex-col tw-flex-1 tw-h-full tw-bg-white tw-gap-3">
                <div className="tw-flex">
                    <div className="tw-p-3 tw-flex tw-flex-col tw-gap-3 md:tw-w-full">
                        <div className="tw-flex tw-items-center tw-gap-2">
                            <button className="btn-secondary" onClick={() => setOpenQuestionPopup(true)}><FiPlus /> Add Question</button>
                        </div>
                        <div className="tw-flex tw-flex-col tw-gap-3">
                            <DataGrid
                                sx={{ width: '100%' }}
                                getRowId={() => uuid_v4()}
                                rows={questions}
                                columns={questionColDefs}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                pageSizeOptions={[5]}
                                disableRowSelectionOnClick
                            />
                        </div>
                    </div>
                </div>
            </div>

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