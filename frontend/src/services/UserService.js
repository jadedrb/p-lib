import axios from 'axios'
import { APILite, authAxios, authAxiosLite } from './api'

class UserService {

    format(d) {
        return d.data
    }

    awaken() {
        return axios.get(APILite + `/auth/awaken`)
    }

    async validateUserToken() {
        try {
            const r = await authAxiosLite().get('/api/users/test')
            return this.format(r)
        } catch(err) {
            throw new Error(err)
        }
    }

    async registerUser(user) {
        try {
            const r = await axios.post(APILite + `/auth/register`, user)
            return this.format(r)
        } catch(err) {
            return err
        }
    }

    async loginUser(user) {
        try {
            const r = await axios.post(APILite + `/auth/login`, user)
            return this.format(r)
        } catch(err) {
            return err
        }
    }

    getUserByName(user) {
        return authAxios().get(`/users/${user}`).then(r => this.format(r))
    } 
    removeUser() {
        return authAxios().delete(`/users`).then(r => this.format(r))
    }
    getUserDetails() {
        return authAxios().get(`/users/overview`).then(r => this.format(r))
    }
    updateUser(user, id) {
        return authAxios().put(`/users`, user).then(r => this.format(r))
    }
}

export default new UserService()