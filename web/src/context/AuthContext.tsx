import React, { ReactNode, useEffect, useState } from 'react'
import authService from '../services/authService'
import { AuthUser } from '../models/auth'

type VoidFn = (error?: string) => void

interface AuthContextValue {
	user: AuthUser
	checkIfUserLoggedIn: () => boolean
	signin: (userName: string, password: string, callback: VoidFn) => void
	signout: (callback?: VoidFn) => void
}

export const AuthContext = React.createContext<AuthContextValue>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser>(null!)

	useEffect(() => {
		checkIfUserLoggedIn()
	}, [])

	const signin = (userName: string, password: string, callback: VoidFn) => {
		authService
			.login(userName, password)
			.then((data: any) => {
				const user = {
					name: data.name,
					role: data.role,
					email: data.email,
					token: data.token,
					expire: data.expire
				}
				setUser(user)
				callback()
			})
			.catch((err) => {
				callback(err)
			})
	}

	const signout = (callback?: VoidFn) => {
		authService.logout()
		if (callback) {
			callback()
		}
	}

	const checkIfUserLoggedIn = () => {
		try {
			const user = authService.getUserProfile()
			setUser(user)
			return !!user?.token
		} catch (e: any) {
			return false
		}
	}

	return (
		<AuthContext.Provider
			value={{ user, checkIfUserLoggedIn, signin, signout }}>
			{children}
		</AuthContext.Provider>
	)
}
