const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config')

module.exports.show = async (req, res) => {
    try {
        const roomResults = await pool.query('SELECT id, email, other, username FROM users WHERE id = $1', [req.id])
        const foundUser = roomResults.rows[0]
        res.send(foundUser)
    } catch(err) {
        res.send({ error: err.message })
    }
}

module.exports.test = async (req, res) => {
    console.log('inside test')
    console.log(req.username)
    res.send(req.username)
}

module.exports.overview = async (req, res) => {
    try {

        // example: /users/overview?user=joe
        if (req.query.user && req.username === process.env.PLIB_ADMIN) 
            req.username = req.query.user

        const roomResults = await pool.query('SELECT id, other, username, created_on FROM users WHERE username = $1', [req.username])
        const foundUser = roomResults.rows[0]

        const ORCLAUSE = (areaIds, blank) => areaIds.map((_, i) => `${i ? 'OR ' : ''}${blank}_id = $${i + 1}`).join(' ')
        const ARGS = (area) => area.map((a) => a.id)

        let bookCount = await pool.query('SELECT COUNT(*) FROM books WHERE user_id = $1', [foundUser.id])
        let rooms = await pool.query('SELECT id FROM rooms WHERE user_id = $1', [foundUser.id])
        let bookcases = await pool.query(`SELECT id FROM bookcases WHERE ${ORCLAUSE(rooms.rows, 'room')}`, ARGS(rooms.rows))
        let shelfCount = await pool.query(`SELECT COUNT(*) FROM shelves WHERE ${ORCLAUSE(bookcases.rows, 'bookcase')}`, ARGS(bookcases.rows))

        const stats = {
            [foundUser.username]: foundUser.id,
            rooms: String(rooms.rows.length),
            bookcases: String(bookcases.rows.length),
            shelves: shelfCount.rows[0].count,
            books: bookCount.rows[0].count,
            created_on: foundUser.created_on
        }

        res.send([foundUser, stats])

    } catch(err) {
        console.log({ error: err.message })
        res.send({ error: err.message })
    }
}

module.exports.update = async (req, res) => {
    try {
        console.log(typeof req.body.other, req.body.other)
        const results = await pool.query(`UPDATE users SET other = '${req.body.other}' WHERE id = $1`, [req.id])
        console.log(results)
        res.send({ message: 'user settings updated successfully' })
    } catch(err) {
        console.log({ error: err.message })
        res.send({ error: err.message })
    }
}