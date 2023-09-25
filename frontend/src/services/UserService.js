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
        return authAxiosLite().get('/api/users/test').then(r => this.format(r)).catch(() => console.log('oops'))
    }

    async registerUser(user) {
        try {
            const r = await axios.post(APILite + `/auth/register`, user)
            return this.format(r)
        } catch(err) {
            return err
        }
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
    getUserDetails() {
        return authAxios().get(`/users/overview`).then(r => this.format(r))
    }
    updateUser(user, id) {
        return authAxios().put(`/users`, user).then(r => this.format(r))
    }
}

export default new UserService()