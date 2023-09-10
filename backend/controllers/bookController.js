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