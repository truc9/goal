import React from "react"
import { useLocalAuth } from "../context/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

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