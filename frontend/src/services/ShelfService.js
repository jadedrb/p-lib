import { authAxios } from './api'
import { loading, clearLoading } from './utility'

class ShelfService {

    format(d) {
        clearLoading()
        return d.data
    }

    addShelfForBookcase(shelf, bookcase) {
        loading(".new-bookcase")
        return authAxios().post(`/shelves/${bookcase}`, shelf).then(r => this.format(r))
    }
    
    removeShelfFromBookcase(id, bookcase) {
        loading(".sh-b")
        return authAxios().delete(`/shelves/${id}/bookcases/${bookcase}`).then(r => this.format(r))
    }
    
    updateShelfOfId(shelf, id) {
        return authAxios().put(`/shelves/${id}`, shelf).then(r => this.format(r))
    }
}

export default new ShelfService();
