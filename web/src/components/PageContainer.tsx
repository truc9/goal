import React from 'react'

import { FiArrowLeftCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

interface Props {
    title: string
    rightTitle?: React.ReactNode
    children?: React.ReactNode
    icon?: React.ReactNode
    showGoBack?: boolean
}

export const PageContainer: React.FC<Props> = ({
    title,
    rightTitle,
    icon,
    showGoBack,
    children,
}) => {

    const navigate = useNavigate()

    return (
        <div className="tw-flex tw-flex-col tw-gap-5 tw-bg-white tw-p-5 tw-rounded-xl tw-border">
            <div className='tw-flex tw-items-center tw-justify-between'>
                {showGoBack && <button className='tw-bg-slate-100 active:tw-ring-offset-2 tw-ring-2 tw-ring-slate-200 tw-text-slate-500 tw-p-2 tw-rounded'
                    onClick={() => navigate(-1)}
                >
                    <FiArrowLeftCircle size={20} />
                </button>}
                <div className="tw-flex tw-items-center tw-gap-3 tw-text-slate-500">
                    {icon && <span className="tw-text-2xl">{icon}</span>}
                    <h3 className="tw-text-lg tw-uppercase">{title}</h3>
                </div>
                {rightTitle}
            </div>
            <div className="tw-flex tw-flex-col tw-gap-3">
                {children}
            </div>
        </div>
    )
}
