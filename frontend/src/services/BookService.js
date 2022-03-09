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

    getColorForUser(color, user) {
        return axios.get(API + `/books/${user}/search/color=${color}`).then(r => this.format(r))
    }

    getPublishDateForUser(pdate, user) {
        return axios.get(API + `/books/${user}/search/published=${pdate}`).then(r => this.format(r))
    }

    getPagesForUser(pages, user) {
        return axios.get(API + `/books/${user}/search/published=${pages}`).then(r => this.format(r))
    }

    getBookCoordinates(id) {
        return axios.get(API + `/books/${id}/coord`).then(r => this.format(r))
    }

    ///

    getTitleInRoom(title, id) {
        return axios.get(API + `/books/search/in/room/${id}/title=${title}`).then(r => this.format(r))
    }

    getGenreInRoom(genre, id) {
        return axios.get(API + `/books/search/in/room/${id}/genre=${genre}`).then(r => this.format(r))
    }

    getGenreAndTitleInRoom(mix, id) {
        return axios.get(API + `/books/search/in/room/${id}/genretitle=${mix}`).then(r => this.format(r))
    }

    getAllInRoom(all, id) {
        return axios.get(API + `/books/search/in/room/${id}/all=${all}`).then(r => this.format(r))
    }

    getColorInRoom(color, id) {
        return axios.get(API + `/books/search/in/room/${id}/color=${color}`).then(r => this.format(r))
    }

    getPublishDateInRoom(pdate, id) {
        return axios.get(API + `/books/search/in/room/${id}/published=${pdate}`).then(r => this.format(r))
    }

    getPagesInRoom(pages, id) {
        return axios.get(API + `/books/search/in/room/${id}/pages=${pages}`).then(r => this.format(r))
    }

    //

    getTitleInBookcase(title, id) {
        return axios.get(API + `/books/search/in/bookcase/${id}/title=${title}`).then(r => this.format(r))
    }

    getGenreInBookcase(genre, id) {
        return axios.get(API + `/books/search/in/bookcase/${id}/genre=${genre}`).then(r => this.format(r))
    }

    getGenreAndTitleInBookcase(mix, id) {
        return axios.get(API + `/books/search/in/bookcase/${id}/genretitle=${mix}`).then(r => this.format(r))
    }

    getAllInBookcase(all, id) {
        return axios.get(API + `/books/search/in/bookcase/${id}/all=${all}`).then(r => this.format(r))
    }

    getColorInBookcase(color, id) {
        return axios.get(API + `/books/search/in/bookcase/${id}/color=${color}`).then(r => this.format(r))
    }

    getPublishDateInBookcase(pdate, id) {
        return axios.get(API + `/books/search/in/bookcase/${id}/published=${pdate}`).then(r => this.format(r))
    }

    getPagesInBookcase(pages, id) {
        return axios.get(API + `/books/search/in/bookcase/${id}/pages=${pages}`).then(r => this.format(r))
    }

    //

    getTitleInShelf(title, id) {
        return axios.get(API + `/books/search/in/shelf/${id}/title=${title}`).then(r => this.format(r))
    }

    getGenreInShelf(genre, id) {
        return axios.get(API + `/books/search/in/shelf/${id}/genre=${genre}`).then(r => this.format(r))
    }

    getGenreAndTitleInShelf(mix, id) {
        return axios.get(API + `/books/search/in/shelf/${id}/genretitle=${mix}`).then(r => this.format(r))
    }

    getAllInShelf(all, id) {
        return axios.get(API + `/books/search/in/shelf/${id}/all=${all}`).then(r => this.format(r))
    }

    getColorInShelf(color, id) {
        return axios.get(API + `/books/search/in/shelf/${id}/color=${color}`).then(r => this.format(r))
    }

    getPublishDateInShelf(pdate, id) {
        return axios.get(API + `/books/search/in/shelf/${id}/published=${pdate}`).then(r => this.format(r))
    }

    getPagesInShelf(pages, id) {
        return axios.get(API + `/books/search/in/shelf/${id}/pages=${pages}`).then(r => this.format(r))
    }

    // /books/{username}/search/more={more}
}

export default new BookService();
