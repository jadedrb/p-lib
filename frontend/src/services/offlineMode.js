import { parsePagesAndDate } from './utility'

export function searchLocalData(query, value, data) {
    if (query === "title" || query === "genre" || query === "color" || query === "author" || query === "more") 
        return data.filter((b) => b[query].toLowerCase().includes(value.toLowerCase()))
    if (query === "language")
        return data.filter((b) => b["lang"].toLowerCase().includes(value.toLowerCase()))
    if (query === "all") 
        return data.filter((b) => b.title.toLowerCase().includes(value.toLowerCase()) || b.author.toLowerCase().includes(value.toLowerCase()) || b.genre.toLowerCase().includes(value.toLowerCase()) || b.more.toLowerCase().includes(value.toLowerCase()) || b.color.toLowerCase().includes(value.toLowerCase()))
    if (query === "published" || query === "pages") {
        let { greater, lesser } = parsePagesAndDate(value, query)
        if (query === "published")
            return data.filter((b) => b.pdate > greater && b.pdate < lesser)
        else
            return data.filter((b) => b.pages > greater && b.pages < lesser)
    }
}

export function getAllBooksFromRooms(data) {

    let bookcases = data.reduce((acc, curr) => [...acc, ...curr.bookcases], [])
    if (bookcases?.length) {
        let shelves = bookcases.reduce((acc, curr) => [...acc, ...curr.shelves], [])    
        if (shelves?.length) {
            let books = shelves.reduce((acc, curr) => [...acc, ...curr.books], [])  
            return books
        }
    }
    return []
}

export function getRandomBook(data) {
    let books = getAllBooksFromRooms(data)
    let random = Math.floor(Math.random() * books.length)
    let book = books[random]
    return {
        book: book.id,
        shelf: book.shelf_id,
        bookcase: book.bookcase_id,
        room: book.room_id
    }
}

export function getMarkers(data, marker) {
    let books = getAllBooksFromRooms(data)
    return books.filter(book => book.markers?.includes(marker))
}