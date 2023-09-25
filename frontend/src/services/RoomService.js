import { authAxios } from './api'
import { loading, clearLoading } from './utility'

class RoomService {

    format(d) {
        clearLoading()
        return d.data
    }

    async getRoomsForUser() {
        loading(".newroom")
        try {
            const r = await authAxios().get(`/rooms`)
            return this.format(r)
        } catch {
            console.log('uhoh'); clearLoading()
            return []
        }
    }
    
    async addRoomForUser(room) {
        loading(".newroom")
        try {
            const r = await authAxios().post(`/rooms`, room)
            return this.format(r)
        } catch {
            console.log('uhoh'); clearLoading()
            return []
        }
    }
    
    async removeRoomFromUser(id, name) {
        loading(".newroom")
        const r = await authAxios().delete(`/rooms/${id}`)
        return this.format(r)
    }
    
    async updateRoomOfId(room, id) {
        loading(".newroom")
        const r = await authAxios().put(`/rooms/${id}`, room)
        return this.format(r)
    }
}

export default new RoomService();