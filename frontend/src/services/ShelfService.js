import axios from 'axios'
import { API } from './api'
import { loading, clearLoading } from './utility'

class ShelfService {

    format(d) {
        clearLoading()
        console.log(d.data)
        return d.data
    }

    getShelvesForBookcase(bookcase) {
        return axios.get(API + `/shelves/${bookcase}`).then(r => this.format(r))
    }

    addShelfForBookcase(shelf, bookcase) {
        loading(".new-bookcase")
        return axios.post(API + `/shelves/${bookcase}`, shelf).then(r => this.format(r))
    }
    
    removeShelfFromBookcase(id, bookcase) {
        loading(".sh-b")
        return axios.delete(API + `/shelves/${id}/bookcases/${bookcase}`).then(r => this.format(r))
    }
    
    updateShelfForBookcase(shelf, id) {
        return axios.put(API + `/shelves/${id}`, shelf).then(r => this.format(r))
    }
}

export default new ShelfService();
