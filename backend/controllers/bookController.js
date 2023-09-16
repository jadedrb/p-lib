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
 
        const bookResult = await pool.query('SELECT author, color, genre, more, pages, pdate, title, lang, markers FROM books WHERE id = $1 AND user_id = $2', [req.params.id, req.id])
        const oldBook = bookResult.rows[0]

        if (!oldBook) throw new Error('Access denied')

        // Compare old books columns with new book columns
        // and reduce it to an array -> [ ['author','new-name'], ['genre', 'new-genre'] ]
        const updatedColumns = Object.keys(oldBook).reduce((acc, curr) => typeof req.body[curr] !== 'undefined' && oldBook[curr] !== req.body[curr] ? [...acc, [curr, req.body[curr]]] : acc, [])

        // Construct a SET clause with only the updated fields and the id at the end -> 'author = $1, genre = $2 WHERE id = $3'
        const AFTERSET = updatedColumns.reduce((acc, c, i, arr) => arr.length > (i + 1) ? acc + `${c[0]} = $${i + 1}, ` : acc + `${c[0]} = $${i + 1}, recorded_on = NOW() WHERE id = $${i + 2}`, '')
    
        // Construct an ARGS array with the updates and the id at the end -> ['Charles Dickens', 'Novel', '3810']
        const ARGS = updatedColumns.reduce((acc, c, i, arr) => arr.length > i + 1 ? [...acc, c[1]] : [...acc, c[1], req.params.id], [])

        await pool.query(`UPDATE books SET ${AFTERSET}`, ARGS)

        // Get the updates to return to the frontend
        const updatedBookResults = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id])
        const newBook = updatedBookResults.rows[0]

        res.json(newBook)
    } catch(err) {
        console.log({ error: err.message })
    }
}

module.exports.create = async (req, res) => {
    try {
        const { title, author, genre, 
            pages, pdate, color, 
            more, lang, rid, shid, bcid } = req.body[0]

        const INSERT = 'INSERT INTO books'
        const COLUMNS = '(title, author, genre, pages, pdate, color, more, lang, room_id, shelf_id, bookcase_id, user_id, recorded_on)'
        const VALUES = 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)'
        const RETURNING = 'RETURNING *'
        const ARGS = [title, author, genre, Number(pages), Number(pdate), color, more, lang, rid, shid, bcid, req.id, new Date()]

        const result = await pool.query(
            INSERT + ' ' + COLUMNS + ' ' +
            VALUES + ' ' + RETURNING, ARGS
        )

        console.log(result)
        console.log('got here to create')
        console.log(req.body)
        console.log(result)
        res.json(result.rows[0])
        /*
        ; 
    [
    {
        title: 'test',
        author: 'wowooo',
        genre: '',
        pages: '',
        pdate: '',
        color: '',
        more: '',
        lang: ''
    }
    ]
    
        */
    } catch(err) {
        console.log(err.message)
        console.log(err)
        
    }
}

module.exports.destroy = async (req, res) => {
    try {
        let { id } = req.params

        const result = await pool.query('DELETE FROM books WHERE id = $1 AND user_id = $2', [id, req.id])
        
        // Unable to find and delete a book that has both the book id (from the parameter) and the user id (from the token) and the  
        if (!result.rowCount) throw new Error('Access denied') 
       
        res.status(200).json({ message: 'book deleted successfully' })
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}