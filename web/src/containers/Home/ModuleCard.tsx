import React from "react"
import { Link } from "react-router-dom"

interface Props {
    title: string
    subTitle: string
    link: string
    icon: React.ReactNode
}

export const ModuleCard: React.FC<Props> = ({
    title,
    subTitle,
    link,
    icon
}) => {

    return (
        <Link to={link}>
            <div className="tw-p-5 tw-gap-3 tw-flex tw-flex-col tw-text-center tw-items-center tw-bg-slate-50 tw-rounded tw-border tw-border-slate-200 hover:tw-shadow" >
                <span>{icon}</span>
                <h3 className="tw-text-2xl">{title}</h3>
                <h5 className="tw-text-xs tw-text-black/40">{subTitle}</h5>
            </div>
        </Link>
    )
}