import { authAxios } from './api'
import { loading, clearLoading } from './utility'

class RoomService {

    format(d) {
        clearLoading()
        return d.data
    }

    getRooms(user) {
        return authAxios().get('/rooms').then(r => this.format(r))
    }

    getRoomOfId(id) {
        loading(".newroom")
        return authAxios().get(`/room/${id}`).then(r => this.format(r)).catch(() => { console.log('uhoh'); clearLoading(); return []; })
    }

    getRoomsForUser(user) {
        loading(".newroom")
        return authAxios().get(`/rooms/${user}`).then(r => this.format(r)).catch(() => { console.log('uhoh'); clearLoading(); return []; })
    }
    
    addRoomForUser(room, user) {
        loading(".newroom")
        return authAxios().post(`/rooms/${user}`, room).then(r => this.format(r)).catch(() => { console.log('uhoh'); clearLoading(); return []; })
    }
    
    removeRoomFromUser(id, name) {
        loading(".newroom")
        return authAxios().delete(`/rooms/${id}/users/${name}`).then(r => this.format(r))
    }
    
    updateRoomOfIdForUser(room, id, name) {
        loading(".newroom")
        return authAxios().put(`/rooms/${id}/users/${name}`, room).then(r => this.format(r))
    }
}

export default new RoomService();