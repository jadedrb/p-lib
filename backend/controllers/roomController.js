const pool = require('../config')
const { constructColumnsValuesAndArgs, constructUpdateQuery } = require('./utility')

module.exports.index = async (req, res) => {
    try {
        // get all rooms for user
        const roomResults = await pool.query('SELECT * FROM rooms WHERE user_id = $1', [req.id])
        const rooms = roomResults.rows
console.log(1, rooms.length, rooms[0])
        let bkResults = await Promise.all(rooms.map(room => pool.query('SELECT * FROM bookcases WHERE room_id = $1', [room.id])))
        let bookcases = bkResults.map(bk => bk.rows).flat()
console.log(2, bookcases.length, bookcases[0])
        let shlvResults = await Promise.all(bookcases.map(bookcase => pool.query('SELECT * FROM shelves WHERE bookcase_id = $1', [bookcase.id])))
        let shelves = shlvResults.map(shlv => shlv.rows).flat()
console.log(3, shelves.length, shelves[0])
        let bookResults = await Promise.all(shelves.map(shelf => pool.query('SELECT * FROM books WHERE shelf_id = $1', [shelf.id])))
        let books = bookResults.map(book => book.rows).flat()
console.log(4, books.length, books[0])
        for (let shelf of shelves) {
            shelf.books = books.filter(b => b.shelf_id == shelf.id)
        }

        for (let bookcase of bookcases) {
            bookcase.shelves = shelves.filter(sh => sh.bookcase_id == bookcase.id).sort((a, b) => Number(a.id) - Number(b.id))
        }

        for (let room of rooms) {
            room.bookcases = bookcases.filter(bk => bk.room_id == room.id)
        }
console.log(5, rooms[0], room.bookcases.length)
        res.status(200).json(rooms)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}

module.exports.create = async (req, res) => {
    try {

       delete req.body.bookcases
       req.body.user_id = req.id

       const { COLUMNS, VALUES, ARGS } = constructColumnsValuesAndArgs(req.body)

       const roomResult = await pool.query(
        'INSERT INTO rooms ' + 
        `(${COLUMNS}) ` + 
        `VALUES (${VALUES}) ` +
        'RETURNING *', 
        [...ARGS])

        const room = roomResult.rows[0]
        room.bookcases = []

        res.status(200).json(room)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}

module.exports.update = async (req, res) => {
    try {

        const [AFTERSET, ARGS] = constructUpdateQuery(req.room, req.body, req.params.id)

        let newRoom;

        // Check for cases where nothing was updated
        if (AFTERSET && ARGS.length) {
            const roomUpdateResult = await pool.query(`UPDATE rooms SET ${AFTERSET} RETURNING *`, ARGS)
            newRoom = roomUpdateResult.rows[0]
        } else {
            console.log('Nothing to update')
            newRoom = req.room
        }

        res.status(200).json(newRoom)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}

module.exports.destroy = async (req, res) => {
    try {

        // Remove the room, bookcase, the shelves, and the books related to it
        const { rows: foundBookcases } = await pool.query('SELECT id FROM bookcases WHERE room_id = $1', [req.params.id])

        let shelfCount = 0

        // delete the books related to the room
        const bookDeleteResult = await pool.query('DELETE FROM books WHERE room_id = $1', [req.params.id])

        // delete the shelves related to the room
        for (let bookcase of foundBookcases) {
            const shelfDeleteResult = await pool.query('DELETE FROM shelves WHERE bookcase_id = $1', [bookcase.id])
            shelfCount += shelfDeleteResult.rowCount
        }

        // delete the bookcases related to the room
        const bookcaseDeleteResult = await pool.query('DELETE FROM bookcases WHERE room_id = $1', [req.params.id])

        // delete the room
        const roomDeleteResult = await pool.query('DELETE FROM rooms WHERE id = $1', [req.params.id])

        console.log('deleted: ' + roomDeleteResult.rowCount + ' room and ' + bookcaseDeleteResult.rowCount + ' bookcase and ' + shelfCount + ' shelves and ' + bookDeleteResult.rowCount + ' books')
       
        res.status(200).json({ message: 'room deleted successfully' })
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}