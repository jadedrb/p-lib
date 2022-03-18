import axios from 'axios'

export const API = 'http://localhost:8080/api'
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