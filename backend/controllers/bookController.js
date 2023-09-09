const pool = require('../config')

module.exports.show = async (req, res) => {
    try {

        let { search, searchIn, searchType, searchId, greater, lesser } = req.query

        let NUM = 1
        let SELECT = 'SELECT * FROM books'
        let WHERE = searchType ? `WHERE ${searchType} ILIKE $${NUM++}` : ''

        if (searchType === 'all') {
            WHERE = `WHERE title ILIKE $1 OR author ILIKE $1 OR more ILIKE $1`
        }

        let numType = searchType === 'pdate' || searchType === 'pages'

        if (numType) {
            WHERE = `WHERE ${searchType} > $1 AND ${searchType} < $2`
            NUM += 1
        }

        let AND = searchIn ? `AND ${searchIn}_id = $${NUM++}` : ''
        let USER = `AND user_id = $${NUM++}`

        let ARGS = []

        if (numType) {
            ARGS = [greater, lesser]
        } else {
            ARGS = [`%${search}%`]
        }

        if (searchId) {
            ARGS.push(searchId)
        }

        ARGS.push(req.id)

        const searchResults = await pool.query(SELECT + ' ' + WHERE + ' ' + AND + ' ' + USER, ARGS)
        const books = searchResults.rows

        res.status(200).json(books)
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports.coord = async (req, res) => {
    try {
        let { id } = req.params
    
        const bookResult = await pool.query('SELECT room_id, shelf_id, id, bookcase_id FROM books WHERE id = $1', [id])
        const book = bookResult.rows[0]

        const coordinates = {
            book: book.id,
            shelf: book.shelf_id,
            bookcase: book.bookcase_id,
            room: book.room_id
        }

        res.status(200).json(coordinates)
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}