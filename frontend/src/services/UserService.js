import axios from 'axios'
import { API } from './api'

export default class UserService {

    static format(d) {
        console.log(d.data)
        return d.data
    }

    static getUser(user) {
        return axios.get(API + `/users/${user}/rooms`).then(r => this.format(r))
    }
    static getUserByName(user) {
        return axios.get(API + `/users/${user}`).then(r => this.format(r))
    }
    static removeUser(id) {
        return axios.delete(API + `/users/${id}`).then(r => this.format(r))
    }
}


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