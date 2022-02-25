import axios from 'axios'
import { API } from './api'

export default class RoomService {

    format(d) {
        console.log(d.data)
        return d.data
    }

    getRooms(user) {
        return axios.get(API + '/rooms').then(r => this.format(r))
    }

    getRoomsForUser(user) {
        return axios.get(API + `/rooms/${user}`).then(r => this.format(r))
    }
    addRoomForUser(user, room) {
        return axios.post(API + `/rooms/${user}`, room).then(r => this.format(r))
    }
    removeRoomFromUser(id, name) {
        return axios.delete(API + `/rooms/${id}/users/${name}`).then(r => this.format(r))
    }
    updateRoomForUser(id, name, room) {
        return axios.put(API + `/rooms/${id}/users/${name}`, room).then(r => this.format(r))
    }

    
    getUser(user) {
        return axios.get(API + `/users/${user}/rooms`).then(r => this.format(r))
    }
    getUserByName(user) {
        return axios.get(API + `/users/${user}`).then(r => this.format(r))
    }
    removeUser(id) {
        return axios.delete(API + `/users/${id}`).then(r => this.format(r))
    }
}