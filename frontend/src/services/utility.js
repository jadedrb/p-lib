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
    console.log("utilPath, " + type + " " + id)
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

let interval;

export function loading(where, initial) {
    let el = document.querySelector(where)
    let prev = document.querySelector(".loading")
    if (!el || prev) return
    let loading, loader, connection;
    loading = document.createElement("div")
    loader = document.createElement("div")
    
    if (initial) {
        connection = document.createElement("div")
        connection.setAttribute("class", `connection`)
        loading.appendChild(connection)
        let percent = 0
        let perCount = 0
        let red = 255
        let blue = 255
        interval = setInterval(() => {
            perCount++
            red-= .5
            blue-= .5
            if (perCount >= 3) {
                perCount -= 3
                percent++
            }

            if (percent > 99)
                clearInterval(interval)
            loader.style.backgroundColor = `rgb(${red}, 255, ${blue})`
            connection.innerText = percent + "%"
        }, 100)
    }
        
    loading.setAttribute("class", `loading ${where}`)
    loader.setAttribute("class", `loader`)

    loading.appendChild(loader)
    el.appendChild(loading)
}



export function clearLoading() {
        let loading = document.querySelector(".loading")
        if (!loading) return
        let parentClass = loading.classList[1]
        let parent = document.querySelector(parentClass)
        parent.removeChild(loading)
        clearInterval(interval)
}

export function utilOrder(results, order, toggle) {

    let originalOrder = order

    if (order.includes("name")) {
        order = "author"
    } 

    if (originalOrder.includes("asc")) {
        toggle = true
        if (order !== "author") {
            console.log('uno')
            order = order.split(" ")[0]
        }
    } else if (originalOrder.includes("desc")) {
        toggle = false
        if (order !== "author") {
            console.log('dos')
            order = order.split(" ")[0]
        }
    }
console.log(order)
    if (order === "author" || order === "title" || order === "color" || order === "more" || order === "genre") {
        return results.sort((a, b) => {
            let aa = { ...a }
            let bb = { ...b }
            if (originalOrder.includes("last")) {
                aa.author = aa.author.split(" ").reverse().join(" ")
                bb.author = bb.author.split(" ").reverse().join(" ")
                console.log('we got here...')
            }
            if (toggle) {
                if (aa[order] < bb[order])
                    return -1;
                if (aa[order] > bb[order])
                    return 1;
            } else {
                if (bb[order] < aa[order])
                    return -1;
                if (bb[order] > aa[order])
                    return 1;
            }
            return 0;
        })
    } 
    else if (order === "pdate" || order === "pages")
        return results.sort((a, b) => toggle ? a[order] - b[order] : b[order] - a[order])
    // else if (order === "lastname") {
    //     let a = results.a.author.split(" ").reverse().join(" ")
    //     let b = results.b.author.split(" ").reverse().join(" ")
    //     return a < b ? -1 : a > b ? 1 : 0
    // }
        
    return results
}



// Did not write this function (copy pasted)
export function componentToHex(c) {
    console.log(c)
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

// Did not write this function (copy pasted)
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function extractRgb(str) {
    return str.slice(0, -1).slice(4).split(",").map(c => Number(c))
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
