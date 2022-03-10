import axios from 'axios'
import { API } from './api'
import { loading, clearLoading } from './utility'

class RoomService {

    format(d) {
        clearLoading()
        return d.data
    }

    getRooms(user) {
        return axios.get(API + '/rooms').then(r => this.format(r))
    }

    getRoomsForUser(user) {
        loading(".newroom")
        return axios.get(API + `/rooms/${user}`).then(r => this.format(r)).catch(() => { console.log('uhoh'); clearLoading(); return []; })
    }
    
    addRoomForUser(room, user) {
        loading(".newroom")
        return axios.post(API + `/rooms/${user}`, room).then(r => this.format(r))
    }
    
    removeRoomFromUser(id, name) {
        loading(".newroom")
        return axios.delete(API + `/rooms/${id}/users/${name}`).then(r => this.format(r))
    }
    
    updateRoomOfIdForUser(room, id, name) {
        loading(".newroom")
        return axios.put(API + `/rooms/${id}/users/${name}`, room).then(r => this.format(r))
    }
}

export default new RoomService();