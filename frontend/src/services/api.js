import axios from 'axios'

export const API = import.meta.env.PROD ? import.meta.env.VITE_API : import.meta.env.VITE_API_DEV
export const APILite = API.slice(0,-4)

export const authAxios = () => axios.create({
    baseURL: API,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})

export const authAxiosLite = () => axios.create({
    baseURL: API.slice(0,-4),
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})