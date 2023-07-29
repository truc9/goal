import React, { ReactNode, useState } from "react"
import authService from "../services/authService"

interface AuthUser {
    name: string
    email: string
    token: string
}

type VoidFn = (error?: string) => void

interface AuthContextValue {
    user: AuthUser
    signin: (userName: string, password: string, callback: VoidFn) => void
    signout: (callback: VoidFn) => void
}

const AuthContext = React.createContext<AuthContextValue>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser>(null!)

    const signin = (userName: string, password: string, callback: VoidFn) => {
        authService.login(userName, password)
            .then((data: any) => {
                setUser({
                    name: data.name,
                    email: data.email,
                    token: data.token
                })
                callback()
            })
            .catch(err => {
                callback(err)
            })
    }

    const signout = (callback: VoidFn) => {
        localStorage.removeItem('token')
        callback()
    }


    return (
        <AuthContext.Provider value={{ user, signin, signout }}>
            {children}
        </AuthContext.Provider >
    )
}

export const useLocalAuth = () => {
    return React.useContext(AuthContext)
}