import axios from 'axios'
import config from './config'
import { RegisterModel } from './models/auth'

async function login(email: string, password: string) {
    const res = await axios.post(`${config.apiUrl}/login`, {
        email,
        password,
    })
    return res.data
}

async function register(model: RegisterModel) {
    const res = await axios.post(`${config.apiUrl}/register`, model)
    return res.data
}

function logout() {
    localStorage.removeItem('token')
}


export default {
    login,
    logout,
    register
}