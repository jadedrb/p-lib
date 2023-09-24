const pool = require('../config')
const { constructUpdateQuery } = require('./utility')

module.exports.update = async (req, res) => {
    try {

        const [AFTERSET, ARGS] = constructUpdateQuery(req.bookcase, req.body, req.params.id)

        let newBookcase;

        // Check for cases where nothing was updated
        if (AFTERSET && ARGS.length) {
            const bookcaseUpdateResult = await pool.query(`UPDATE bookcases SET ${AFTERSET} RETURNING *`, ARGS)
            newBookcase = bookcaseUpdateResult.rows[0]
        } else {
            console.log('Nothing to update')
            newBookcase = req.bookcase
        }

        res.status(200).json(newBookcase)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
    }
}


module.exports.create = async (req, res) => {
    try {

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