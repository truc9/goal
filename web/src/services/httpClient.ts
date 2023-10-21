import axios, { AxiosResponse } from "axios"
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
    return await axios.post<T>(url, body, {
        headers: getHeader()
    })
}

const remove = async <T = any>(resource: string) => {
    const url = `${config.apiUrl}/${resource}`
    await axios.delete<T>(url, {
        headers: getHeader()
    })
}

const put = async <T = any, TResult = any>(resource: string, model: T): Promise<TResult> => {
    const url = `${config.apiUrl}/${resource}`
    const res = await axios.put<T, AxiosResponse<TResult, any>>(url, model, {
        headers: getHeader()
    })
    return res.data
}

export default {
    get,
    post,
    remove,
    put
}