import axios from 'axios'

export const API = 'http://localhost:8080/api'

export const authAxios = () => axios.create({
    baseURL: API,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
})