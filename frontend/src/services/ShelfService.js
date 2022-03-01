import axios from 'axios'
import { API } from './api'

class ShelfService {

    format(d) {
        console.log(d.data)
        return d.data
    }

    getShelvesForBookcase(bookcase) {
        return axios.get(API + `/shelves/${bookcase}`).then(r => this.format(r))
    }

    addShelfForBookcase(shelf, bookcase) {
        return axios.post(API + `/shelves/${bookcase}`, shelf).then(r => this.format(r))
    }
    
    removeShelfFromBookcase(id, bookcase) {
        return axios.delete(API + `/shelves/${id}/bookcases/${bookcase}`).then(r => this.format(r))
    }
    
    updateShelfForBookcase(shelf, id) {
        return axios.put(API + `/shelves/${id}`, shelf).then(r => this.format(r))
    }
}

export default new ShelfService;
