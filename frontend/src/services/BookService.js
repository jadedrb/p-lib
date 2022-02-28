import axios from 'axios'
import { API } from './api'

export default class BookService {

    static format(d) {
        console.log(d.data)
        return d.data
    }

    static getBooksForShelf(shelf) {
        return axios.get(API + `/books/${shelf}`).then(r => this.format(r))
    }

    static addBookForShelfAndUser(book, shelf, user) {
        return axios.post(API + `/books/${shelf}/users/${user}`, book).then(r => this.format(r))
    }
    
    static removeBookFromShelfAndUser(id, shelf, user) {
        return axios.delete(API + `/books/${id}/shelves/${shelf}/users/${user}`).then(r => this.format(r))
    }
    
    static updateBookForShelf(book, id) {
        return axios.put(API + `/books/${id}`, book).then(r => this.format(r))
    }

    // SEARCH Endpoints

    static getTitleForUser(title, user) {
        return axios.get(API + `/books/${user}/search/title=${title}`).then(r => this.format(r))
    }

    static getGenreForUser(genre, user) {
        return axios.get(API + `/books/${user}/search/genre=${genre}`).then(r => this.format(r))
    }

    static getMoreForUser(more, user) {
        return axios.get(API + `/books/${user}/search/more=${more}`).then(r => this.format(r))
    }

    static getAllForUser(all, user) {
        return axios.get(API + `/books/${user}/search/all=${all}`).then(r => this.format(r))
    }
}
