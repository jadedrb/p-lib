const pool = require('../config')

module.exports.update = async (req, res) => {
    try {

        // Follow the relationship between the target resource and the token id
        const shelfResult = await pool.query('SELECT bookcase_id FROM shelves WHERE id = $1', [req.params.id])
        const bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [shelfResult.rows[0].bookcase_id])
        const roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [bookcaseResult.rows[0].room_id])

        // Check if resource leads to a user id that matches the token id
        if (roomResult.rows[0]?.user_id != req.id) throw new Error('Access denied')

        const updateShelfResult = await pool.query(`UPDATE shelves SET organize = $1 WHERE id = $2 RETURNING *`, [req.body.organize, req.params.id])

        res.status(200).json(updateShelfResult.rows[0])
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}

module.exports.create = async (req, res) => {
    try {

        const shelves = []

        for (let _ of req.body) {
            const shelfResult = await pool.query('INSERT INTO shelves (organize, bookcase_id) VALUES ($1, $2) RETURNING *', ['', req.params.bookcase_id])
            const shelf = shelfResult.rows[0]
            shelf.books = []
            shelves.push(shelf)
        }

        res.status(200).json(shelves)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}


module.exports.destroy = async (req, res) => {
    try {

        // Follow the relationship between the target resource and the token id
        const shelfResult = await pool.query('SELECT bookcase_id FROM shelves WHERE id = $1', [req.params.id])
        const bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [shelfResult.rows[0].bookcase_id])
        const roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [bookcaseResult.rows[0].room_id])

        // Check if resource leads to a user id that matches the token id
        if (roomResult.rows[0]?.user_id != req.id) throw new Error('Access denied')

        // Remove the shelf then the books related to it
        const bookDeleteResult = await pool.query('DELETE FROM books WHERE shelf_id = $1', [req.params.id])
        const shelfDeleteResult = await pool.query('DELETE FROM shelves WHERE id = $1', [req.params.id])
        console.log('deleted: ' + shelfDeleteResult.rowCount + ' shelf and ' + bookDeleteResult.rowCount + ' books')
       
        res.status(200).json({ message: 'shelf deleted successfully' })
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}