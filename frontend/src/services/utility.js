export function utilitySelector(rid, bcid, shid, rms) {
    let rooms = [ ...rms ]
    let roomIndex, room, bkcase, bkcaseIndex, shelfIndex, shelf;
    if (rid) {
        roomIndex = rooms.findIndex((r) => r.id === Number(rid))
        room = rooms[roomIndex]
        if (bcid && room) {
            bkcaseIndex = room.bookcases.findIndex((b) => b.id === Number(bcid))
            bkcase = room.bookcases[bkcaseIndex]
            if (shid && bkcase) {
                shelfIndex = bkcase.shelves.findIndex((sh) => sh.shelfId === Number(shid))
                shelf = bkcase.shelves[shelfIndex]
            }
        }
    }
    return { roomIndex, room, rooms, bkcase, bkcaseIndex, shelfIndex, shelf }
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