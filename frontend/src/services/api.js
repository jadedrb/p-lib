import axios from 'axios'

export const API = process.env.NODE_ENV === "production" ? process.env.REACT_APP_API : process.env.REACT_APP_API_DEV
export const APILite = API.slice(0,-4)

export const authAxios = () => axios.create({
    baseURL: API,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
})

export const authAxiosLite = () => axios.create({
    baseURL: API.slice(0,-4),
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
})