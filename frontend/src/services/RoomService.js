import axios from 'axios'
import { API } from './api'

class RoomService {

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
    
    addRoomForUser(room, user) {
        return axios.post(API + `/rooms/${user}`, room).then(r => this.format(r))
    }
    
    removeRoomFromUser(id, name) {
        return axios.delete(API + `/rooms/${id}/users/${name}`).then(r => this.format(r))
    }
    
    updateRoomOfIdForUser(room, id, name) {
        return axios.put(API + `/rooms/${id}/users/${name}`, room).then(r => this.format(r))
    }
}

export default new RoomService();