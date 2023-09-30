import React from 'react'

interface Props {
    title: string
    rightTitle?: React.ReactNode
    children?: React.ReactNode
    icon?: React.ReactNode
}

export const PageContainer: React.FC<Props> = ({
    title,
    rightTitle,
    icon,
    children
}) => {
    return (
        <div className="tw-flex tw-flex-col tw-gap-5 tw-bg-white tw-p-5 tw-rounded-xl tw-border">
            <div className='tw-flex tw-items-center tw-justify-between'>
                <div className="tw-flex tw-items-center tw-gap-3 tw-text-slate-500">
                    <span className="tw-text-2xl">{icon}</span>
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
