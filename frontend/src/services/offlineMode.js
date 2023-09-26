// export function searchLocalData(query, data) {

//     let { searchIn, search, searchType, searchId, lesser, greater } = query

//     let books = getAllBooksFromRooms(data)

//     if (searchType !== 'pages' && searchType !== 'pdate' && searchType !== 'all')
//         books = books.filter(book => book[searchType].toLowerCase().includes(search.toLowerCase()))
//     else if (searchType === 'all') {
//         books = books.filter(book => {
//             if (book['title'].toLowerCase().includes(search.toLowerCase()))
//                 return true 
//             if (book['more'].toLowerCase().includes(search.toLowerCase())) 
//                 return true
//             if (book['author'].toLowerCase().includes(search.toLowerCase()))
//                 return true
//             return false
//         })
//     } else {
//         console.log(lesser, greater)
//         books = books.filter(book => book)
//     }

//     if (searchIn) 
//         books = books.filter(book => book[`${searchIn}_id`] === searchId)
//     console.log(query)
//     return books
// }

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