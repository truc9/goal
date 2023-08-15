import { FC, ReactNode } from "react"

interface Props {
    children: ReactNode
    title?: string
}

export const Card: FC<Props> = ({
    children,
    title
}) => {

    return (
        <div className="tw-p-5 tw-text-black/40 tw-gap-3 tw-flex tw-flex-col tw-text-center tw-items-center tw-bg-slate-50 tw-border tw-rounded">
            <div>
                {children}
            </div>
            <div className="tw-font-bold">
                {title}
            </div>
        </div >
    )
}