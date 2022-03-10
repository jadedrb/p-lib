import axios from 'axios'
import { API } from './api'
import { loading, clearLoading } from './utility'

class BookcaseService {

    format(d) {
        console.log(d.data)
        clearLoading()
        return d.data
    }

    getRooms(user) {
        return axios.get(API + '/rooms').then(r => this.format(r))
    }

    getBookcasesForRoom(room) {
        return axios.get(API + `/bookcases/${room}`).then(r => this.format(r))
    }

    addBookcaseForRoom(bookcase, room) {
        loading(".newroom")
        return axios.post(API + `/bookcases/${room}`, bookcase).then(r => this.format(r))
    }
    
    removeBookcaseFromRoom(id, room) {
        loading(".new-bookcase")
        return axios.delete(API + `/bookcases/${id}/rooms/${room}`).then(r => this.format(r))
    }
    
    updateBookcaseForRoom(bookcase, id) {
        loading(".new-bookcase")
        return axios.put(API + `/bookcases/${id}`, bookcase).then(r => this.format(r))
    }
}

export default new BookcaseService();
