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
