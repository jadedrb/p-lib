import axios from 'axios'
import { API } from './api'
import { loading, clearLoading } from './utility'

class BookService {

    format(d) {
        clearLoading()
        console.log(d.data)
        return d.data
    }

    // handleError(d, e) {
    //     clearLoading()
    //     console.log(e)
    //     return d
    // }

    getBooksForShelf(shelf) {
        return axios.get(API + `/books/${shelf}`).then(r => this.format(r))
    }

    addBookForShelfAndUser(book, shelf, user) {
        loading(".booklist-r")
        return axios.post(API + `/books/${shelf}/users/${user}`, book).then(r => this.format(r))
    }
    
    removeBookFromShelfAndUser(id, shelf, user) {
        loading(".booklist-r")
        return axios.delete(API + `/books/${id}/shelves/${shelf}/users/${user}`).then(r => this.format(r))
    }
    
    updateBookForShelf(book, id) {
        loading(".booklist-r")
        return axios.put(API + `/books/${id}`, book).then(r => this.format(r))//.catch((e) => this.handleError(book, e))
    }

    // SEARCH Endpoints

    getTitleForUser(title, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/title=${title}`).then(r => this.format(r))
    }

    getGenreForUser(genre, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/genre=${genre}`).then(r => this.format(r))
    }

    getMoreForUser(more, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/more=${more}`).then(r => this.format(r))
    }

    getAllForUser(all, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/all=${all}`).then(r => this.format(r))
    }

    getColorForUser(color, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/color=${color}`).then(r => this.format(r))
    }

    getAuthorForUser(author, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/author=${author}`).then(r => this.format(r))
    }

    getPublishDateForUser(pdate, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/published=${pdate.lesser}&${pdate.greater}`).then(r => this.format(r))
    }

    getPagesForUser(pages, user) {
        loading(".search-c")
        return axios.get(API + `/books/${user}/search/pages=${pages.lesser}&${pages.greater}`).then(r => this.format(r))
    }

    getBookCoordinates(id) {
        return axios.get(API + `/books/${id}/coord`).then(r => this.format(r))
    }

    ///

    getTitleInRoom(title, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/title=${title}`).then(r => this.format(r))
    }

    getGenreInRoom(genre, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/genre=${genre}`).then(r => this.format(r))
    }

    getGenreAndTitleInRoom(mix, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/genretitle=${mix}`).then(r => this.format(r))
    }

    getAllInRoom(all, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/all=${all}`).then(r => this.format(r))
    }

    getColorInRoom(color, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/color=${color}`).then(r => this.format(r))
    }

    getAuthorInRoom(author, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/author=${author}`).then(r => this.format(r))
    }

    getMoreInRoom(more, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/more=${more}`).then(r => this.format(r))
    }

    getPublishDateInRoom(pdate, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/published=${pdate.lesser}&${pdate.greater}`).then(r => this.format(r))
    }

    getPagesInRoom(pages, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/room/${id}/pages=${pages.lesser}&${pages.greater}`).then(r => this.format(r))
    }

    //

    getTitleInBookcase(title, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/title=${title}`).then(r => this.format(r))
    }

    getGenreInBookcase(genre, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/genre=${genre}`).then(r => this.format(r))
    }

    getGenreAndTitleInBookcase(mix, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/genretitle=${mix}`).then(r => this.format(r))
    }

    getAllInBookcase(all, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/all=${all}`).then(r => this.format(r))
    }

    getColorInBookcase(color, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/color=${color}`).then(r => this.format(r))
    }

    getAuthorInBookcase(author, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/author=${author}`).then(r => this.format(r))
    }

    getMoreInBookcase(more, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/more=${more}`).then(r => this.format(r))
    }

    getPublishDateInBookcase(pdate, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/published=${pdate.lesser}&${pdate.greater}`).then(r => this.format(r))
    }

    getPagesInBookcase(pages, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/bookcase/${id}/pages=${pages.lesser}&${pages.greater}`).then(r => this.format(r))
    }

    //

    getTitleInShelf(title, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/title=${title}`).then(r => this.format(r))
    }

    getGenreInShelf(genre, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/genre=${genre}`).then(r => this.format(r))
    }

    getGenreAndTitleInShelf(mix, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/genretitle=${mix}`).then(r => this.format(r))
    }

    getAllInShelf(all, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/all=${all}`).then(r => this.format(r))
    }

    getColorInShelf(color, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/color=${color}`).then(r => this.format(r))
    }

    getAuthorInShelf(author, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/author=${author}`).then(r => this.format(r))
    }

    getMoreInShelf(more, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/more=${more}`).then(r => this.format(r))
    }

    getPublishDateInShelf(pdate, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/published=${pdate.lesser}&${pdate.greater}`).then(r => this.format(r))
    }

    getPagesInShelf(pages, id) {
        loading(".search-c")
        return axios.get(API + `/books/search/in/shelf/${id}/pages=${pages.lesser}&${pages.greater}`).then(r => this.format(r))
    }

    // /books/{username}/search/more={more}
}

export default new BookService();
