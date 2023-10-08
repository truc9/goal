import { useEffect, useState } from "react"
import cn from "classnames"
import AssessmentModel from "../HSE/models/AssessmentModel"
import assessmentService from "../../services/assessmentService"
import { FiEdit, FiFile, FiTriangle } from "react-icons/fi"
import { Outlet, useNavigate } from "react-router-dom"
import useBearStore from "../../store"
import { Popup } from "../../components/Popup"
import { FormGroup, FormLabel } from "@mui/material"

const AssessmentSetup = () => {
    const navigate = useNavigate()

    const addGlobalAction = useBearStore(state => state.addGlobalAction)
    const removeGlobalAction = useBearStore(state => state.removeGlobalAction)

    const [assessments, setAssessments] = useState<AssessmentModel[]>([])
    const [curAssessmentId, setCurAssessmentId] = useState(0)

    const [assessmentPopupOpen, setAssessmentPopupOpen] = useState(false)
    const [assessmentModel, setAssessmentModel] = useState<AssessmentModel>({
        name: '',
        description: ''
    })

    useEffect(() => {
        init()

        addGlobalAction({
            key: 'addAssessment',
            name: "Assessment",
            actionFn: createAssessment
        })

        return () => {
            removeGlobalAction('addAssessment')
        }
    }, [])

    async function init() {
        await loadAssessments()
    }

    async function loadAssessments() {
        const assessments = await assessmentService.getAll()
        setAssessments(assessments)
    }

    function onItemChange(e: AssessmentModel) {
        setCurAssessmentId(e.id!)
        navigate(`${e.id!}`)
    }

    function showPopup() {
        setAssessmentModel({ name: '', description: '' })
        setAssessmentPopupOpen(true)
    }

    function createAssessment() {
        showPopup()
    }

    function editAssessment(item: AssessmentModel) {
        setAssessmentModel(item)
        setAssessmentPopupOpen(true)
    }

    function onAssessmentChange(e: any) {
        setAssessmentModel({
            ...assessmentModel,
            [e.target.name]: e.target.value
        })
    }

    async function submit() {
        if (!assessmentModel.id) {
            await assessmentService.create(assessmentModel.name, assessmentModel.description)
        }
        else {
            await assessmentService.update(assessmentModel.id, assessmentModel)
        }
        setAssessmentPopupOpen(false)
        await loadAssessments()
    }

    return (
        <div className="tw-flex tw-flex-1 tw-h-full tw-p-2 tw-border">
            <div className="tw-shadow tw-flex tw-flex-col tw-w-[300px] tw-h-full tw-flex-grow-0 tw-overflow-auto tw-border-r">
                <div className="tw-h-full tw-overflow-auto">
                    {assessments.map((item: AssessmentModel, index: number) => {
                        return (
                            <button
                                key={index}
                                onClick={() => onItemChange(item)}
                                className={cn("tw-bg-white tw-relative tw-transition-all tw-w-full tw-border-b tw-border-b-slate-200 tw-p-2 tw-h-28 [&.active]:tw-border-l-4 [&.active]:tw-bg-lime-50 tw-border-lime-500 hover:tw-border-l-4 hover:tw-bg-lime-50 tw-text-left tw-flex tw-flex-col tw-gap-3 tw-justify-center", { "active": item.id === curAssessmentId })}
                            >
                                <div className="tw-text-left tw-flex tw-items-center tw-gap-2">
                                    <span><FiFile size={16} /></span>
                                    <div className="tw-font-bold">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="tw-flex tw-w-full tw-justify-between">
                                    <span className="tw-text-xs">{item.description}</span>
                                </div>
                                <div className="tw-flex tw-items-center tw-gap-3 tw-justify-end tw-w-full">
                                    <button onClick={() => editAssessment(item)}><FiEdit /></button>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
            <main className="tw-flex-1">
                <Outlet />
            </main>

            <Popup
                icon={<FiTriangle />}
                size="sm"
                title="Create Assessment"
                isOpen={assessmentPopupOpen}
                onCloseClicked={() => setAssessmentPopupOpen(false)}
                onSubmitClicked={submit}
            >
                <div className='tw-flex tw-flex-col tw-items-center tw-gap-3'>
                    <FormGroup sx={{ width: "100%" }}>
                        <FormLabel>Name</FormLabel>
                        <input value={assessmentModel.name} onChange={onAssessmentChange} type="text" name="name" id="name" />
                    </FormGroup>
                    <FormGroup sx={{ width: "100%" }}>
                        <FormLabel>Description</FormLabel>
                        <textarea value={assessmentModel.description} onChange={onAssessmentChange} name='description' id='description' rows={5}></textarea>
                    </FormGroup>
                </div>
            </Popup>
        </div >
    )
}

export default AssessmentSetup