import axios from 'axios'
import { API } from './api'

export default class ShelfService {

    static format(d) {
        console.log(d.data)
        return d.data
    }

    static getShelvesForBookcase(bookcase) {
        return axios.get(API + `/shelves/${bookcase}`).then(r => this.format(r))
    }

    static addShelfForBookcase(shelf, bookcase) {
        return axios.post(API + `/shelves/${bookcase}`, shelf).then(r => this.format(r))
    }
    
    static removeShelfFromBookcase(id, bookcase) {
        return axios.delete(API + `/shelves/${id}/bookcases/${bookcase}`).then(r => this.format(r))
    }
    
    static updateShelfForBookcase(shelf, id) {
        return axios.put(API + `/shelves/${id}`, shelf).then(r => this.format(r))
    }
}
