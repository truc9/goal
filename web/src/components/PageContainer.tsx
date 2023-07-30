import React from "react"

interface Props {
    title: string
    children?: React.ReactNode
    icon?: React.ReactNode
}

export const PageContainer: React.FC<Props> = ({
    title,
    icon,
    children
}) => {

    return (
        <div className="tw-flex tw-flex-col tw-gap-3 tw-bg-white tw-p-5 tw-rounded tw-border">
            <div className="tw-flex tw-items-center tw-gap-3">
                {icon}
                <h3 className="tw-text-2xl">{title}</h3>
            </div>
            <div className="tw-flex tw-flex-col tw-gap-3">
                {children}
            </div>
        </div>
    )
}