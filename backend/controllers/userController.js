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