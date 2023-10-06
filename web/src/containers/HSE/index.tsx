import {
    FC,
    ReactNode,
    useEffect,
    useState,
} from 'react'

import {
    FiPlus,
    FiTriangle,
    FiXCircle,
} from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

import {
    FormGroup,
    FormLabel,
} from '@mui/material'

import { PageContainer } from '../../components/PageContainer'
import { Popup } from '../../components/Popup'
import assessmentService from '../../services/assessmentService'
import AssessmentModel from './models/AssessmentModel'

interface AssessmentProps {
    name: string
    id: number
    icon?: ReactNode
    backColor?: string
    foreColor?: string
    onClick?: (e: any) => void
    onDeleteClick?: (e: any) => void
}
const AssessmentContainer: FC<AssessmentProps> = ({
    id,
    name,
    icon,
    onClick,
    onDeleteClick
}) => {

    const handleClick = () => {
        if (onClick) {
            onClick(id)
        }
    }

    const handleDeleteClick = () => {
        if (onDeleteClick) {
            onDeleteClick(id)
        }
    }

    return (
        <div className="tw-relative tw-z-0 tw-bg-slate-100 tw-flex tw-text-center tw-gap-3 tw-flex-col tw-items-center tw-h-36 hover:tw-cursor-pointer tw-rounded tw-p-2 tw-transition-all tw-border">
            <button className='tw-transition-all tw-z-10 tw-bg-red-500 active:tw-bg-red-400 tw-text-white tw-p-1 hover:tw-ring-offset-2 tw-ring-2 tw-ring-red-500 hover:tw-ring-red-400 tw-rounded-full tw-absolute -tw-right-2 -tw-top-2' onClick={handleDeleteClick} > <FiXCircle /></button >
            <button onClick={handleClick} className='tw-flex tw-h-full tw-w-full tw-flex-col tw-p-2 tw-items-center tw-justify-around tw-transition-all tw-rounded'>
                {icon && <span className='tw-text-3xl'>{icon}</span>}
                <div className="tw-flex-1 tw-flex tw-w-full tw-justify-center tw-items-center">
                    <h3 className='tw-uppercase'>{name}</h3>
                </div>
            </button>
        </div >
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

    const handleClick = (id: number) => {
        navigate(`/hse/${id}`)
    }

    const handleDeleteClick = async (id: number) => {
        if (confirm("Do you want to delete ?")) {
            await assessmentService.deleteById(id)
            loadAssessments()
        }
    }

    return (
        <PageContainer
            title="HSE"
            icon={<FiTriangle />}
            action={(
                <div>
                    <button className='btn-primary' onClick={showPopup}><FiPlus /> Create</button>
                </div>
            )}
        >
            <div className="tw-grid-cols-2 tw-grid md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
                {assessments.map((item: AssessmentModel, index: number) => {
                    return (
                        <AssessmentContainer
                            id={item.id!}
                            key={index}
                            icon={<IoCheckmarkCircle className="tw-text-green-500" size={40} />}
                            name={item.name}
                            onClick={handleClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    )
                })}

                <Popup
                    icon={<FiTriangle />}
                    size="sm"
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