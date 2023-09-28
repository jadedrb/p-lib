const pool = require('../config')
const { constructUpdateQuery } = require('./utility')

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

        if (id === 'random') {
            const { rows } = await pool.query('SELECT id FROM books WHERE user_id = $1', [req.id])
            let random = Math.floor(Math.random() * rows.length)
            id = rows[random].id
        } 

        const { rows } = await pool.query('SELECT room_id, shelf_id, id, bookcase_id FROM books WHERE id = $1', [id])
        book = rows[0]
        
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

module.exports.count = async (req, res) => {
    try {
        
        let { category } = req.params
        category = category === 'languages' ? category.slice(0, 4) : category.slice(0, -1)

        const catInfoDraft = {}
        const catInfoFinal = {}

        const { rows } = await pool.query(`SELECT ${category} FROM books WHERE user_id = $1`, [req.id])

        // { genre: 'Novel' }  -> row
        for (let row of rows) {

            let categoryValue = row[category]

            const separator = categoryValue.includes('/') ? '/' : categoryValue.includes('&') ? '&' : null

            // { genre: 'Novel / Mystery' }  -> sometimes a row is like this
            if (separator) {

                // ['Novel', 'Mystery'] -> after split
                for(let key of categoryValue.split(separator)) {
                    categoryCounter(key)
                }
            } else {
                categoryCounter(categoryValue)
            }

            function categoryCounter(key) {
                key = key.trim()
                catInfoDraft[key] ? catInfoDraft[key]++ : catInfoDraft[key] = 1
    
                // { genre: 1, mystery: 1 } -> catInfoFinal after inner loop
                if (catInfoDraft[key] > 2 || categoryValue !== 'author')
                    catInfoFinal[key] = catInfoDraft[key] 
            } 

        }
        
        res.status(200).json(catInfoFinal)
    } catch(err) {
        console.log({ error: err.message })
        res.status(400).json({ error: err.message })
    }
}

module.exports.update = async (req, res) => {
    try {

        const [AFTERSET, ARGS] = constructUpdateQuery(req.book, req.body, req.params.id)

        let newBook;

        // Check for cases where nothing was updated
        if (AFTERSET && ARGS.length) {
            const bookUpdateResult = await pool.query(`UPDATE books SET ${AFTERSET} RETURNING *`, ARGS)
            console.log(`UPDATE books SET ${AFTERSET} RETURNING *`, ARGS)
            newBook = bookUpdateResult.rows[0]
        } else {
            console.log('Nothing to update')
            newBook = req.book
        }

        res.status(200).json(newBook)
    } catch(err) {
        console.log({ error: err.message })
        res.status(400).json({ error: err.message })
    }
}

module.exports.create = async (req, res) => {
    try {

        let books = []

        for (let book of req.body) {

            const { title, author, genre, 
                pages, pdate, color, 
                more, lang, rid, shid, bcid } = book
    
            const INSERT = 'INSERT INTO books'
            const COLUMNS = '(title, author, genre, pages, pdate, color, more, lang, room_id, shelf_id, bookcase_id, user_id, recorded_on)'
            const VALUES = 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)'
            const RETURNING = 'RETURNING *'
            const ARGS = [title, author, genre, Number(pages), Number(pdate), color, more, lang, rid, shid, bcid, req.id, new Date()]
    
            const result = await pool.query(
                INSERT + ' ' + COLUMNS + ' ' +
                VALUES + ' ' + RETURNING, ARGS
            )
    
            // console.log(result)
            console.log('got here to create')
            console.log(req.body)
            // console.log(result)
            books.push(result.rows[0])
            
        }
        
        res.json(books)

    } catch(err) {
        console.log(err.message)
        console.log(err)
        
    }
}

module.exports.destroy = async (req, res) => {
    try {
        let { id } = req.params

        await pool.query('DELETE FROM books WHERE id = $1', [id])
       
        res.status(200).json({ message: 'book deleted successfully' })
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}