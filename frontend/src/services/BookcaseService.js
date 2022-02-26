import axios from 'axios'
import { API } from './api'

export default class BookcaseService {

    static format(d) {
        console.log(d.data)
        return d.data
    }


    getRooms(user) {
        return axios.get(API + '/rooms').then(r => this.format(r))
    }

    static getBookcasesForRoom(room) {
        return axios.get(API + `/bookcases/${room}`).then(r => this.format(r))
    }

    static addBookcaseForRoom(bookcase, room) {
        return axios.post(API + `/bookcases/${room}`, bookcase).then(r => this.format(r))
    }
    
    static removeBookcaseFromRoom(id, room) {
        return axios.delete(API + `/bookcases/${id}/rooms/${room}`).then(r => this.format(r))
    }
    
    static updateBookcaseForRoom(bookcase, id) {
        return axios.put(API + `/bookcases/${id}`, bookcase).then(r => this.format(r))
    }
}
