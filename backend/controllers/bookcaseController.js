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