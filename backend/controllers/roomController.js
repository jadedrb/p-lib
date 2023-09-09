const pool = require('../config')

module.exports.index = async (req, res) => {
    try {
        // get all rooms for user
        const roomResults = await pool.query('SELECT * FROM rooms WHERE user_id = $1', [req.id])
        const rooms = roomResults.rows

        let bkResults = await Promise.all(rooms.map(room => pool.query('SELECT * FROM bookcases WHERE room_id = $1', [room.id])))
        let bookcases = bkResults.map(bk => bk.rows).flat()

        let shlvResults = await Promise.all(bookcases.map(bookcase => pool.query('SELECT * FROM shelves WHERE bookcase_id = $1', [bookcase.id])))
        let shelves = shlvResults.map(shlv => shlv.rows).flat()

        let bookResults = await Promise.all(shelves.map(shelf => pool.query('SELECT * FROM books WHERE shelf_id = $1', [shelf.id])))
        let books = bookResults.map(book => book.rows).flat()

        for (let shelf of shelves) {
            shelf.books = books.filter(b => b.shelf_id === shelf.id)
        }

        for (let bookcase of bookcases) {
            bookcase.shelves = shelves.filter(sh => sh.bookcase_id === bookcase.id)
        }

        for (let room of rooms) {
            room.bookcases = bookcases.filter(bk => bk.room_id === room.id)
        }

        res.status(200).json(rooms)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}
