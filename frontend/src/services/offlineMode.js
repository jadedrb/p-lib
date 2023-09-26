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