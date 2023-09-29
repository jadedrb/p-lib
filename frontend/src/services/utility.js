export function utilitySelector(rid, bcid, shid, rms, bid) {
    let rooms = [ ...rms ]
    let roomIndex, room, bkcase, bkcaseIndex, shelfIndex, shelf, bookIndex, book;
    if (rid) {
        roomIndex = rooms.findIndex((r) => r.id == rid)
        room = rooms[roomIndex]
        if (bcid && room) {
            bkcaseIndex = room.bookcases.findIndex((b) => {
                return b.id == bcid
            })
            bkcase = room.bookcases[bkcaseIndex]
            if (shid && bkcase) {
                shelfIndex = bkcase.shelves.findIndex((sh) => sh.id == shid)
                shelf = bkcase.shelves[shelfIndex]
            }
            if (bid && shelf) {
                bookIndex = shelf.books.findIndex((b) => b.id == bid)
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
        case 'coord':
            let { book, shelf, bookcase, room } = path 
            let result = ''

            if (room) result += '/room/' + room
            if (bookcase) result += '/bookcase/' + bookcase
            if (shelf) result += '/shelf/' + shelf
            if (book) result += '/book/' + book
            
            return result
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
            return `This will remove a Bookcase (id: ${details.bookcase.id}), which has ${details.bookcase.shelves.length} shelves with ${details.bookcase.shelves.reduce((totalBooks,shelf) => {
                console.log(totalBooks, shelf)
                return totalBooks + shelf.books.length
            }, 0)} book(s) total. Are you sure you want to continue?`
        case 'shelf':
            return details.shelf.books.length ? `This will remove a Shelf (id: ${details.shelf.id}), which has ${details.shelf.books.length} book(s). Are you sure you want to continue?` : `This will remove an empty Shelf (id: ${details.shelf.id}). Continue?`
        case 'book':
            return `This will remove a Book (id: ${details.bid}, title: ${details.title ? details.title : "Untitled"}). Continue?`
        default:
            break;
    }
    console.log('here?')
}

let interval;
let percent = 0;
let perCount = 0
// let red = 255
// let blue = 255
// let green = 255

export function loading(where, initial, extra) {

    let el = document.querySelector(where)
    let prev = document.querySelector(".loading")

    if (!el || prev) return

    let loading, loader, connection;
    loading = document.createElement("div")
    loader = document.createElement("div")
    
    connection = document.createElement("div")
    connection.setAttribute("class", `connection`)
    loading.appendChild(connection)

    perCount = 0
    // red = 255
    // blue = 255
    // green = 255

    interval = setInterval(() => {
        perCount++
        // red -= .5
        // blue -= .5
        // green -= .5
        
        if (perCount >= 3) {
            perCount -= 3
            percent++
        }

        if (percent > 99)
            clearInterval(interval)
        
        // loader.style.backgroundColor = `rgb(${red}, ${blue}, 255)`

        if (initial === true || (initial === 'maybe' && percent > 15)) 
            connection.innerText = percent + "%"
    }, 100)

    loading.setAttribute("class", `loading ${where}${extra ? ' ' + extra : ''}`)
    loader.setAttribute("class", `loader`)

    loading.appendChild(loader)
    el.appendChild(loading)
}



export function clearLoading() {

        let loading = document.querySelector(".loading")
        if (!loading) return
// console.trace()
        let parentClass = loading.classList[1]
        let parent = document.querySelector(parentClass)
        let connection = document.querySelector(".connection")
   
        if (connection.innerText && percent < 100) {
            let interval2 = setInterval(() => {
                percent++
                // red-= .5
                // blue-= .5

                if (connection.innerText && percent < 30) 
                    percent = 90

                if (percent > 99) {

                    clearInterval(interval)
                    clearInterval(interval2)
           
                    for (let i = 0; i < parent.childNodes.length; i++) {
                        if (parent?.childNodes[i]?.classList[0] === "loading") {
                            parent.removeChild(loading)
                        }
                    }
                    percent = 0
                }
            }, 40)
        } else {
            parent.removeChild(loading)
            clearInterval(interval)
            percent = 0
        }
}

export function utilOrder(results, order, toggle) {

    let originalOrder = order

    if (order.includes("name")) {
        order = "author"
    } 

    if (originalOrder.includes("asc")) {
        toggle = true
        if (order !== "author") {
            order = order.split(" ")[0]
        }
    } else if (originalOrder.includes("desc")) {
        toggle = false
        if (order !== "author") {
            order = order.split(" ")[0]
        }
    }
    if (order === "author" || order === "title" || order === "color" || order === "more" || order === "genre" || order === "lang") {
        return results.sort((a, b) => {
            let aa = { ...a }
            let bb = { ...b }
            if (originalOrder.includes("last")) {
                aa.author = aa.author?.split(" ").reverse().join(" ")
                bb.author = bb.author?.split(" ").reverse().join(" ")
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

export const utilTime = (date) => {
    if (!date) return
    let dateObj = new Date(date);
    let year = String(dateObj.getFullYear()).slice(2)
    let month = dateObj.getUTCMonth() + 1
    let day = dateObj.getDate()
    return `${month}/${day}/${year}`
}

export const THREE_MONTHS_TIME = 1000 * 60 * 60 * 24 * 7 * 4 * 3



export const parsePagesAndDate = (search, searchType) => {
    let greater, lesser;
    // All this is to handle better searches for publish date and pages
    if (/s/.test(search)) {
        if (searchType === "published") {
            let tenYearStart = Number(search.split("s")[0])
            greater = tenYearStart - 1
            lesser = tenYearStart + 11
        } else {
            let hundredYearStart = Number(search.split("s")[0])
            greater = hundredYearStart - 1
            lesser = hundredYearStart + 101
        }
    }
    if (/>/.test(search)) {
        let rinse = search.split(">")
        greater = rinse.filter(p => !/>/.test(p) && p !== "")
        if (greater.length > 1) 
            greater = rinse.filter(p => !/</.test(p)).join().trim()
        else 
            greater = greater.join().split("<")[0].trim()
    }
    if (/</.test(search)) {
        let rinse = search.split("<")
        lesser = rinse.filter(p => !/</.test(p) && p !== "")
        if (lesser.length > 1) 
            lesser = rinse.filter(p => !/>/.test(p)).join().trim()
        else 
            lesser = lesser.join().split(">")[0].trim()
    }

    if (!greater && !lesser && search.length > 0) {
        greater = Number(search.trim()) - 1
        lesser = Number(search.trim()) + 1
    } else if (greater && !lesser) {
        lesser = "9999"
    } else if (!greater && lesser) {
        greater = "0"
    }

    return { greater: Number(greater), lesser: Number(lesser) }
}