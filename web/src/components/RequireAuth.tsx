import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import useLocalAuth from "../hooks/useLocalAuth"

interface Props {
    children: React.ReactNode
}

const RequireAuth: React.FC<Props> = ({
    children
}) => {
    const auth = useLocalAuth()
    const location = useLocation()
    if (!auth.user?.token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default RequireAuth