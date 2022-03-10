export function utilitySelector(rid, bcid, shid, rms, bid) {
    let rooms = [ ...rms ]
    let roomIndex, room, bkcase, bkcaseIndex, shelfIndex, shelf, bookIndex, book;
    if (rid) {
        roomIndex = rooms.findIndex((r) => r.id === Number(rid))
        room = rooms[roomIndex]
        if (bcid && room) {
            bkcaseIndex = room.bookcases.findIndex((b) => b.id === Number(bcid))
            bkcase = room.bookcases[bkcaseIndex]
            if (shid && bkcase) {
                shelfIndex = bkcase.shelves.findIndex((sh) => sh.id === Number(shid))
                shelf = bkcase.shelves[shelfIndex]
            }
            if (bid && shelf) {
                bookIndex = shelf.books.findIndex((b) => b.id === Number(bid))
                book = shelf.books[bookIndex]
            }
        }
    }
    return { roomIndex, room, rooms, bkcase, bkcaseIndex, shelfIndex, shelf, bookIndex, book }
}

export function utilPath(path, type, id) {
    console.log(path, type, id)
    let index;
    switch (type) {
        case 'book':
            index = 7
            break;
        case 'shelf':
            index = 5
            break;
        case 'bookcase':
            index = 3
            break;
        case 'room':
            index = 1
            break;
        case 'coord':
            console.log(path)
            let { book, shelf, bookcase, room } = path 
            return `/room/${room}/bookcase/${bookcase}/shelf/${shelf}/book/${book}`
        default:
            break;
    }
    return path.pathname.split("/").slice(0, index).join("/") + `/${type}/` + id
}

export function randomNum() {
    return Math.floor(Math.random() * 255)
}

export function pretendId() {
    return randomNum() + randomNum() + randomNum()
}

export function utilMsg(info) {
    let { type, details } = info
    switch(type) {
        case 'room':
            return `This will remove a Room (id: ${details.room.id}), which has ${details.room.bookcases.length} bookcases with ${details.room.bookcases.reduce((totalShelves,bookcase) => totalShelves + bookcase.shelves.length, 0)} shelves(s) total and ${details.room.bookcases.reduce((totalBooksOverall,bookcase) => {
                return totalBooksOverall + bookcase.shelves.reduce((totalB, shelf) => totalB + shelf.books.length, 0) 
            }, 0)} books(s) altogether. Are you sure you want to continue?`
        case 'bookcase':
            return `This will remove a Bookcase (id: ${details.bookcase.id}), which has ${details.bookcase.shelves.length} shelves with ${details.bookcase.shelves.reduce((totalBooks,shelf) => totalBooks + shelf.books.length, 0)} book(s) total. Are you sure you want to continue?`
        case 'shelf':
            return details.shelf.books.length ? `This will remove a Shelf (id: ${details.shelf.id}), which has ${details.shelf.books.length} book(s). Are you sure you want to continue?` : `This will remove an empty Shelf (id: ${details.shelf.id}). Continue?`
        case 'book':
            return `This will remove a Book (id: ${details.bid}, title: ${details.title ? details.title : "Untitled"}). Continue?`
        default:
            break;
    }
}


/*

let newRooms = state.rooms.map(r => {
                if (rid === r.id)
                    return r.bookcases.map(bk => {
                        if (bcid === bk.id)
                            return null
                        else 
                            return bk
                    })
                else
                    return r
            })

*/
