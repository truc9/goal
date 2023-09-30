import {
    FC,
    ReactNode,
    useState,
} from 'react'

import {
    FiPlus,
    FiTriangle,
} from 'react-icons/fi'

import {
    FormGroup,
    FormLabel,
} from '@mui/material'

import { PageContainer } from '../../components/PageContainer'
import { Popup } from '../../components/Popup'

interface AssessmentProps {
    name: string
    id: string
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
            className="tw-bg-slate-50 tw-shadow tw-flex tw-text-center tw-gap-3 tw-flex-col tw-justify-center tw-items-center tw-h-36 hover:tw-cursor-pointer tw-rounded-xl tw-p-3 hover:tw-bg-slate-100 tw-transition-all">
            <span className="tw-text-3xl">{icon}</span>
            <h3 className="text-center">{name}</h3>
        </div>
    )
}

interface AddButtonProps {
    onClick: (e: any) => void
}
const AddButton: FC<AddButtonProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className="group tw-shadow tw-h-36 tw-w-full tw-bg-white tw-flex tw-items-center tw-justify-center tw-border-2 tw-border-dashed hover:tw-border-slate-500 hover:tw-cursor-pointer tw-text-slate-500 tw-rounded-lg tw-p-3">
            <h3 className="tw-flex tw-items-center tw-gap-2"><FiPlus size={30} /></h3>
        </div>
    )
}

const HSE: FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <PageContainer title="HSE" icon={<FiTriangle />}>
            <div className="tw-grid-cols-2 tw-grid md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
                <AddButton onClick={() => setIsOpen(true)} />
                <Assessment icon={<FiTriangle />} backColor="red" foreColor="white" id="1" name="Office HSE Assessment" />
                <Assessment id="1" name="Office HSE Checklist" />
                <Assessment id="1" name="Office HSE Checklist" />
                <Assessment id="1" name="Office HSE Checklist" />
                <Assessment id="1" name="Office HSE Checklist" />
                <Assessment id="1" name="Office HSE Checklist" />
                <Assessment id="1" name="Office HSE Checklist" />
                <Popup title="Create Assessment" isOpen={isOpen} onCloseClicked={() => setIsOpen(false)}>
                    <div className='tw-flex tw-flex-col tw-items-center tw-gap-3'>
                        <FormGroup sx={{ width: "100%" }}>
                            <FormLabel>Name</FormLabel>
                            <input type="text" name="name" id="name" />
                        </FormGroup>
                        <FormGroup sx={{ width: "100%" }}>
                            <FormLabel>Description</FormLabel>
                            <textarea name='description' id='description' rows={5}></textarea>
                        </FormGroup>
                    </div>
                </Popup>
            </div>
        </PageContainer>
    )
}

export default HSE