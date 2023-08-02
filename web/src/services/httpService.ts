import axios from "axios"
import config from "../config"
import authService from "./authService"

const get = async <T = any>(resource: string) => {
    const url = `${config.apiUrl}/${resource}`
    const { token } = authService.getAuthUser()
    const res = await axios.get<T>(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return res.data!
}

const post = async <T = any>(resource: string, body?: T) => {
    const url = `${config.apiUrl}/${resource}`
    const { token } = authService.getAuthUser()
    await axios.post<T>(url, body, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

const remove = async <T = any>(resource: string) => {
    const url = `${config.apiUrl}/${resource}`
    const { token } = authService.getAuthUser()
    await axios.delete<T>(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default {
    get,
    post,
    remove
}