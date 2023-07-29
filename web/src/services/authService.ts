import axios from 'axios'
import config from './config'
import { AuthUser, RegistrationUser } from './models/auth'

const authKey = '__user__'

async function login(email: string, password: string) {
    const res = await axios.post(`${config.apiUrl}/login`, {
        email,
        password,
    })
    localStorage.setItem(authKey, JSON.stringify(res.data))
    return res.data
}

async function register(model: RegistrationUser) {
    const res = await axios.post(`${config.apiUrl}/register`, model)
    return res.data
}

function logout() {
    localStorage.removeItem(authKey)
}

function getAuthUser(): AuthUser {
    const res = localStorage.getItem(authKey)
    if (!res) throw new Error("User not logged in")
    return JSON.parse(res)
}

export default {
    getAuthUser,
    login,
    logout,
    register
}