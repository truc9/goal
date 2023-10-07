import { useEffect, useState } from "react"
import cn from "classnames"
import AssessmentModel from "../HSE/models/AssessmentModel"
import assessmentService from "../../services/assessmentService"
import { FiFile } from "react-icons/fi"
import { Outlet, useNavigate } from "react-router-dom"

const AssessmentSetup = () => {
    const [assessments, setAssessments] = useState<AssessmentModel[]>([])
    const [curAssessmentId, setCurAssessmentId] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        load()
    }, [])

    async function load() {
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

    return (
        <div className="tw-flex tw-flex-1 tw-h-full tw-p-2 tw-border">
            <div className="tw-bg-white tw-shadow tw-flex tw-flex-col tw-w-[260px] tw-h-full tw-overflow-auto tw-border-r">
                <div className="tw-h-full">
                    {assessments.map((item: AssessmentModel, index: number) => {
                        return (
                            <button
                                key={index}
                                onClick={() => onItemChange(item)}
                                className={cn("tw-transition-all tw-w-full tw-p-2 tw-h-20 [&.active]:tw-border-l-4 [&.active]:tw-bg-orange-50 tw-border-orange-500 hover:tw-border-l-4 hover:tw-bg-orange-50 tw-text-left tw-flex tw-flex-col tw-gap-2 tw-justify-center", { "active": item.id === curAssessmentId })}
                            >
                                <div className="tw-text-left tw-flex tw-items-center tw-gap-2">
                                    <span><FiFile size={16} /></span>
                                    <span className="tw-font-bold">
                                        {item.description}
                                    </span>
                                </div>
                                <div className="tw-flex tw-w-full tw-justify-between">
                                    <span className="tw-text-xs">2 versions</span>
                                    <span className="tw-text-xs">Draft</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
            <main className="tw-flex-1">
                <Outlet />
            </main>
        </div >
    )
}

export default AssessmentSetup