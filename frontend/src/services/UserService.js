import axios from 'axios'
import { API } from './api'

class UserService {

    format(d) {
        // console.log(d.data)
        return d.data
    }

    getUser(user) {
        return axios.get(API + `/users/${user}/rooms`).then(r => this.format(r))
    }
    getUserByName(user) {
        return axios.get(API + `/users/${user}`).then(r => this.format(r))
    }
    addUser(user) {
        return axios.post(API + `/users`, user).then(r => this.format(r))
    }   
    removeUser(id) {
        return axios.delete(API + `/users/${id}`).then(r => this.format(r))
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