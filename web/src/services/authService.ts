import axios from 'axios'
import { AuthUser, RegistrationUser } from '../models/auth'
import config from '../config'

axios.interceptors.response.use((res) => res, (err) => {
    if (err.response.status === 401) {
        clearToken()
        window.location.reload()
    }
})

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
    clearToken()
}

function clearToken() {
    localStorage.removeItem(authKey)
}

function getUserProfile(): AuthUser {
    const res = localStorage.getItem(authKey)
    if (!res) throw new Error("User not logged in")
    const auth = JSON.parse(res) as AuthUser
    return auth
}

export default {
    getUserProfile,
    login,
    logout,
    register
}