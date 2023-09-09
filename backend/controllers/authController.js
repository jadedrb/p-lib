const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../config')

function generateToken(user) {
    const payload = { id: user.id, username: user.username }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
    return token
}

module.exports.awake = async (req, res) => {
    res.send('Hello World!')
}

module.exports.login = async (req, res) => {

    try {

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [req.body.username])
        const foundUser = result.rows[0]
        
        if (!foundUser) {
            return res.status(404).json({ error: 'No such user exists' })
        }

        const validPass = await bcrypt.compare(req.body.password, foundUser.password)

        if (!validPass) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const token = generateToken(foundUser)

        res.status(200).json(token)

    } catch(err) {

        console.log(err.message)
        res.status(400).json({ error: err.message })
    }

}