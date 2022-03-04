import axios from 'axios'
import { API } from './api'

class BookService {

    format(d) {
        console.log(d.data)
        return d.data
    }

    getBooksForShelf(shelf) {
        return axios.get(API + `/books/${shelf}`).then(r => this.format(r))
    }

    addBookForShelfAndUser(book, shelf, user) {
        return axios.post(API + `/books/${shelf}/users/${user}`, book).then(r => this.format(r))
    }
    
    removeBookFromShelfAndUser(id, shelf, user) {
        return axios.delete(API + `/books/${id}/shelves/${shelf}/users/${user}`).then(r => this.format(r))
    }
    
    updateBookForShelf(book, id) {
        return axios.put(API + `/books/${id}`, book).then(r => this.format(r))
    }

    // SEARCH Endpoints

    getTitleForUser(title, user) {
        return axios.get(API + `/books/${user}/search/title=${title}`).then(r => this.format(r))
    }

    getGenreForUser(genre, user) {
        return axios.get(API + `/books/${user}/search/genre=${genre}`).then(r => this.format(r))
    }

    getMoreForUser(more, user) {
        return axios.get(API + `/books/${user}/search/more=${more}`).then(r => this.format(r))
    }

    getAllForUser(all, user) {
        return axios.get(API + `/books/${user}/search/all=${all}`).then(r => this.format(r))
    }
}

export default new BookService();
