import {
    FC,
    ReactNode,
    useEffect,
    useState,
} from 'react'

import {
    FiAlertTriangle,
    FiPlus,
    FiTriangle,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import {
    FormGroup,
    FormLabel,
} from '@mui/material'

import { PageContainer } from '../../components/PageContainer'
import { Popup } from '../../components/Popup'
import { AssessmentModel } from '../../models/assessment'
import assessmentService from '../../services/assessmentService'

interface AssessmentProps {
    name: string
    id: number
    icon?: ReactNode
    backColor?: string
    foreColor?: string
    onClick?: (e: any) => void
}
const Assessment: FC<AssessmentProps> = ({
    id,
    name,
    icon,
    onClick
}) => {

    const handleClick = () => {
        if (onClick) {
            onClick(id)
        }
    }

    return (
        <div
            onClick={handleClick}
            className="tw-bg-emerald-50 tw-ring-2 tw-ring-emerald-100 hover:tw-ring-offset-2 active:tw-ring-offset-4 tw-flex tw-text-center tw-gap-3 tw-flex-col tw-justify-center tw-items-center tw-h-36 hover:tw-cursor-pointer tw-rounded-xl tw-p-2 tw-transition-all">
            <div className='tw-h-8 tw-items-center tw-w-full tw-justify-center tw-flex'>
                <span className="tw-text-3xl">{icon}</span>
            </div>
            <div className="tw-flex-1 tw-flex tw-w-full tw-h-full tw-justify-center tw-items-center">
                <h3>{name}</h3>
            </div>
        </div>
    )
}

interface AddButtonProps {
    onClick: (e: any) => void
}
const AddButton: FC<AddButtonProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className="group tw-shadow tw-h-36 tw-w-full tw-ring-slate-200 tw-flex tw-items-center tw-justify-center tw-border-2 tw-border-dashed hover:tw-border-slate-500 hover:tw-cursor-pointer tw-text-slate-500 tw-rounded-lg tw-p-3">
            <h3 className="tw-flex tw-items-center tw-gap-2"><FiPlus size={30} /></h3>
        </div>
    )
}

const Hse: FC = () => {
    const navigate = useNavigate()
    const [isPopupOpen, togglePopup] = useState(false)
    const [assessmentModel, setAssessmentModel] = useState<AssessmentModel>({
        name: '',
        description: ''
    })
    const [assessments, setAssessments] = useState<AssessmentModel[]>([])

    useEffect(() => {
        loadAssessments()
    }, [])

    const handleChange = (e: any) => {
        setAssessmentModel({
            ...assessmentModel,
            [e.target.name]: e.target.value
        })
    }

    const loadAssessments = async () => {
        const assessments = await assessmentService.get()
        setAssessments(assessments)
    }

    const createAssessment = async () => {
        await assessmentService.create(assessmentModel.name, assessmentModel.description)
        togglePopup(false)
        await loadAssessments()
    }

    const showPopup = () => {
        setAssessmentModel({ name: '', description: '' })
        togglePopup(true)
    }

    const hidePopup = () => togglePopup(false)

    const handleAssessmentClick = (id: number) => {
        navigate(`/hse/${id}`)
    }

    return (
        <PageContainer
            title="HSE"
            icon={<FiTriangle />}
            rightTitle={<span>{assessments && <span>{assessments.length}</span>} active assessments</span>}
        >
            <div className="tw-grid-cols-2 tw-grid md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
                <AddButton onClick={showPopup} />
                {assessments.map((item: AssessmentModel, index: number) => {
                    return (
                        <Assessment
                            id={item.id!}
                            key={index}
                            icon={<FiAlertTriangle />}
                            name={item.name}
                            onClick={() => handleAssessmentClick(item.id!)}
                        />
                    )
                })}
                <Popup
                    icon={<FiTriangle />}
                    title="Create Assessment"
                    isOpen={isPopupOpen}
                    onCloseClicked={hidePopup}
                    onSubmitClicked={createAssessment}
                >
                    <div className='tw-flex tw-flex-col tw-items-center tw-gap-3'>
                        <FormGroup sx={{ width: "100%" }}>
                            <FormLabel>Name</FormLabel>
                            <input value={assessmentModel.name} onChange={handleChange} type="text" name="name" id="name" />
                        </FormGroup>
                        <FormGroup sx={{ width: "100%" }}>
                            <FormLabel>Description</FormLabel>
                            <textarea value={assessmentModel.description} onChange={handleChange} name='description' id='description' rows={5}></textarea>
                        </FormGroup>
                    </div>
                </Popup>
            </div>
        </PageContainer>
    )
}

export default Hse