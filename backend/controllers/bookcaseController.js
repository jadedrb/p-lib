const pool = require('../config')
const { constructUpdateQuery } = require('./utility')

module.exports.update = async (req, res) => {
    try {

        // Follow the relationship between the target resource and the token id
        const bookcaseResult = await pool.query('SELECT * FROM bookcases WHERE id = $1', [req.params.id])
        const oldBookcase = bookcaseResult.rows[0]

        const roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [oldBookcase.room_id])

        // Check if resource leads to a user id that matches the token id
        if (roomResult.rows[0]?.user_id !== req.id) throw new Error('Access denied')

        const [AFTERSET, ARGS] = constructUpdateQuery(oldBookcase, req.body, req.params.id)

        let newBookcase;

        // Check for cases where nothing was updated
        if (AFTERSET && ARGS.length) {
            const bookcaseUpdateResult = await pool.query(`UPDATE bookcases SET ${AFTERSET} RETURNING *`, ARGS)
            newBookcase = bookcaseUpdateResult.rows[0]
        } else {
            console.log('Nothing to update')
            newBookcase = oldBookcase
        }

        res.status(200).json(newBookcase)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}


module.exports.create = async (req, res) => {
    try {

        // Follow the relationship between the target resource and the token id
        const roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [req.body[0].room_id])

        // Check if resource leads to a user id that matches the token id
        if (roomResult.rows[0]?.user_id !== req.id) throw new Error('Access denied')

        const bookcases = []

        for (let bk of req.body) {

            const bookcaseResult = await pool.query(
                'INSERT INTO bookcases ' + 
                `(${Object.keys(bk).join(', ')}) ` + 
                'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
                'RETURNING *', 
            Object.values(bk))

            const bookcase = bookcaseResult.rows[0]
            bookcase.shelves = []
            bookcases.push(bookcase)
        }

        res.status(200).json(bookcases)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}

module.exports.destroy = async (req, res) => {
    try {

        // Follow the relationship between the target resource and the token id
        const bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [req.params.id])
        const roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [bookcaseResult.rows[0].room_id])

        // Check if resource leads to a user id that matches the token id
        if (roomResult.rows[0]?.user_id !== req.id) throw new Error('Access denied')

        // Remove the bookcase, the shelves, and the books related to it
        const bookDeleteResult = await pool.query('DELETE FROM books WHERE bookcase_id = $1', [req.params.id])
        const shelfDeleteResult = await pool.query('DELETE FROM shelves WHERE bookcase_id = $1', [req.params.id])
        const bookcaseDeleteResult = await pool.query('DELETE FROM bookcases WHERE id = $1', [req.params.id])
        console.log('deleted: ' + bookcaseDeleteResult.rowCount + ' bookcase and ' + shelfDeleteResult.rowCount + ' shelves and ' + bookDeleteResult.rowCount + ' books')
       
        res.status(200).json({ message: 'bookcase deleted successfully' })
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}