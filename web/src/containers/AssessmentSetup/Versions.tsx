import { useEffect, useState } from "react"
import cn from "classnames"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { AssessmentVersionModel } from "../HSE/models/AssessmentVersionModel"
import assessmentService from "../../services/assessmentService"
import { FiFile } from "react-icons/fi"
import { IoListCircle } from "react-icons/io5"

const Versions = () => {
    const { assessmentId } = useParams()
    const navigate = useNavigate()
    const [curVersionId, setCurVersionId] = useState<number>()
    const [versions, setVersions] = useState<AssessmentVersionModel[]>([])

    useEffect(() => {
        load()
    }, [assessmentId])

    async function load() {
        const versions = await assessmentService.getVersions(+assessmentId!)
        setVersions(versions)
    }

    function onItemChange(e: AssessmentVersionModel) {
        setCurVersionId(e.id)
        navigate(`versions/${e.id!}`)
    }

    return (
        <div className="tw-flex tw-flex-1 tw-h-full">
            <div className="tw-bg-white tw-flex tw-flex-col tw-w-[300px] tw-h-full tw-overflow-auto tw-border-r">
                <div className="tw-h-full">
                    {versions.map((item: AssessmentVersionModel, index: number) => {
                        return (
                            <button
                                key={index}
                                onClick={() => onItemChange(item)}
                                className={cn(
                                    " tw-border-b tw-border-b-slate-200 tw-transition-all tw-w-full tw-p-2 tw-h-28 [&.active]:tw-border-l-4 [&.active]:tw-bg-lime-50 tw-border-lime-500 hover:tw-bg-lime-50 tw-text-left tw-flex tw-flex-col tw-gap-2 tw-justify-center",
                                    { "active": item.id === curVersionId }
                                )}
                            >
                                <div className="tw-text-left tw-flex tw-items-center tw-gap-2">
                                    <span><FiFile size={16} /></span>
                                    <span>
                                        Version {item.version}
                                    </span>
                                </div>
                                <div className="tw-flex tw-w-full tw-justify-between">
                                    <span className="tw-text-xs tw-flex tw-gap-2 tw-items-center tw-text-slate-400"><IoListCircle />{item.questionCount} questions</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
            <main className="tw-flex-1 tw-bg-white">
                <Outlet />
            </main>
        </div >
    )
}

export default Versions