import React from "react"
import { Link } from "react-router-dom"

interface Props {
    disabled?: boolean
    title: string
    subTitle: string
    link: string
    icon: React.ReactNode
}

export const ClickableCard: React.FC<Props> = ({
    title,
    subTitle,
    link,
    icon,
    disabled
}) => {

    const content = (
        <>
            <span>{icon}</span>
            <h3 className="tw-text-2xl">{title}</h3>
            <h5 className="tw-text-xs tw-text-black/40">{subTitle}</h5>
        </>
    )

    if (disabled) {
        return (
            <div className="tw-p-5 tw-text-black/40 tw-gap-3 tw-flex tw-flex-col tw-text-center tw-items-center tw-bg-slate-200 tw-rounded">
                {content}
            </div>
        )
    }

    return (
        <Link to={link} className="tw-p-5 tw-gap-3 tw-flex tw-flex-col tw-text-center tw-items-center tw-bg-slate-50 tw-rounded tw-border tw-border-slate-200 hover:tw-bg-slate-100">
            {content}
        </Link>
    )
}