import axios from 'axios'
import { APILite, authAxios, authAxiosLite } from './api'

class UserService {

    format(d) {
        return d.data
    }

    awaken() {
        return axios.get(APILite + `/auth/awaken`)
    }

    validateUserToken() {
        return authAxiosLite().get('/auth/test').then(r => this.format(r)).catch(e => console.log(e))
    }

    registerUser(user) {
        return axios.post(APILite + `/auth/register`, user).then(r => this.format(r))
    }

    loginUser(user) {
        return axios.post(APILite + `/auth/login`, user).then(r => this.format(r))
    }

    getUser(user) {
        return authAxios().get(`/users/${user}/rooms`).then(r => this.format(r))
    }
    getUserByName(user) {
        return authAxios().get(`/users/${user}`).then(r => this.format(r))
    }
    addUser(user) {
        return authAxios().post(`/users`, user).then(r => this.format(r))
    }   
    removeUser(id) {
        return authAxios().delete(`/users/${id}`).then(r => this.format(r))
    }
}

export default new UserService()


/*

    getUser(user) {
        return axios.get(API + `/users/${user}/rooms`).then(r => this.format(r))
    }
    getUserByName(user) {
        return axios.get(API + `/users/${user}`).then(r => this.format(r))
    }
    removeUser(id) {
        return axios.delete(API + `/users/${id}`).then(r => this.format(r))
    }

*/