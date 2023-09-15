import { authAxios } from './api'
import { loading, clearLoading } from './utility'

class BookService {

    format(d) {
        clearLoading()
        return d.data
    }

    getBooksForShelf(shelf) {
        return authAxios().get(`/books/${shelf}`).then(r => this.format(r))
    }

    addBooksToShelf(book) {
        loading(".booklist-r")
        return authAxios().post(`/books`, book).then(r => this.format(r))
    }
    
    removeBookFromShelfAndUser(id, shelf, user) {
        loading(".booklist-r")
        return authAxios().delete(`/books/${id}/shelves/${shelf}/users/${user}`).then(r => this.format(r))
    }
    
    updateBookForShelf(book, id) {
        loading(".booklist-r")
        return authAxios().put(`/books/${id}`, book).then(r => this.format(r))//.catch((e) => this.handleError(book, e))
    }

    // SEARCH Endpoints

    getBookCoordinates(id) {
        return authAxios().get(`/books/${id}/coord`).then(r => this.format(r))
    }

    getUserCategoryCount(user, category) {
        return authAxios().get(`/books/${category}/count`).then(r => this.format(r)) 
    }

    getThisInThat(query) {
        loading(".search-c")

        let search = typeof query.search === 'string' ? `search=${query.search}&` : ''
        let greater = typeof query.search === 'object' && query.search.greater ? `greater=${query.search.greater}&` : ''
        let lesser = typeof query.search === 'object' && query.search.lesser ? `lesser=${query.search.lesser}&` : ''
        let searchIn = query.searchIn ? `searchIn=${query.searchIn}&` : ''
        let searchType = query.searchType ? `searchType=${query.searchType}&` : ''
        let searchId = query.searchId ? `searchId=${query.searchId}&` : ''

        return authAxios().get(`/books/search?${search}${searchIn}${searchType}${searchId}${greater}${lesser}`.slice(0, -1)).then(r => this.format(r))
    }
}

export default new BookService();
