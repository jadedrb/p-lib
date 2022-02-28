import axios from 'axios'
import { API } from './api'

export default class RoomService {

    static format(d) {
        console.log(d.data)
        return d.data
    }

    static getRooms(user) {
        return axios.get(API + '/rooms').then(r => this.format(r))
    }

    static getRoomsForUser(user) {
        return axios.get(API + `/rooms/${user}`).then(r => this.format(r))
    }
    
    static addRoomForUser(room, user) {
        return axios.post(API + `/rooms/${user}`, room).then(r => this.format(r))
    }
    
    static removeRoomFromUser(id, name) {
        return axios.delete(API + `/rooms/${id}/users/${name}`).then(r => this.format(r))
    }
    
    static updateRoomOfIdForUser(room, id, name) {
        return axios.put(API + `/rooms/${id}/users/${name}`, room).then(r => this.format(r))
    }
}