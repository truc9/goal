import axios from "axios"
import config from "../config"
import authService from "./authService"

const getHeader = () => {
    const { token } = authService.getUserProfile()
    return {
        'Authorization': `Bearer ${token}`
    }
}

const get = async <T = any>(resource: string) => {
    const url = `${config.apiUrl}/${resource}`
    const res = await axios.get<T>(url, {
        headers: getHeader()
    })
    return res.data!
}

const post = async <T = any>(resource: string, body?: T) => {
    const url = `${config.apiUrl}/${resource}`
    await axios.post<T>(url, body, {
        headers: getHeader()
    })
}

const remove = async <T = any>(resource: string) => {
    const url = `${config.apiUrl}/${resource}`
    await axios.delete<T>(url, {
        headers: getHeader()
    })
}

const put = async <T = any>(resource: string, model: T) => {
    const url = `${config.apiUrl}/${resource}`
    await axios.put<T>(url, model, {
        headers: getHeader()
    })
}

export default {
    get,
    post,
    remove,
    put
}