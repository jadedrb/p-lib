import { authAxios } from './api'
import { loading, clearLoading } from './utility'

class BookcaseService {

    format(d) {
        clearLoading()
        return d.data
    }

    getRooms(user) {
        return authAxios().get('/rooms').then(r => this.format(r))
    }

    getBookcasesForRoom(room) {
        return authAxios().get(`/bookcases/${room}`).then(r => this.format(r))
    }

    addBookcaseForRoom(bookcase, room) {
        loading(".newroom")
        return authAxios().post(`/bookcases/${room}`, bookcase).then(r => this.format(r))
    }
    
    removeBookcaseFromRoom(id, room) {
        loading(".new-bookcase")
        return authAxios().delete(`/bookcases/${id}/rooms/${room}`).then(r => this.format(r))
    }
    
    updateBookcaseForRoom(bookcase, id) {
        loading(".new-bookcase")
        return authAxios().put(`/bookcases/${id}`, bookcase).then(r => this.format(r))
    }
}

export default new BookcaseService();
