import React from "react"
import { Loading } from "./Loading"

interface Props {
    loading: boolean
    children: React.ReactNode
}

export const AsyncContent: React.FC<Props> = ({ loading, children }) => {
    if (loading) return <div className="tw-p-5"><Loading /></div>
    return (
        <>
            {children}
        </>
    )
}