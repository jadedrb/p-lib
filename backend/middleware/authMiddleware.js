const jwt = require('jsonwebtoken')
const pool = require('../config')

// check the token for authorization
function authorize(req, res, next) {
    console.log(req.method + ' ' + req.originalUrl)
    try {

        let token = req.header("Authorization")

        if (!token) {
            return res.status(403).json({ error: 'No token provided'})
        }

        token = token.replace("Bearer ", "")

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        if (payload.error) {
            return res.status(403).json({ error: payload.error })
        }

        req.id = payload.id 
        req.username = payload.username

        next()

    } catch(err) {

        console.log(err.message)
        res.status(403).json({ error: err.message })

    }
}

// check the user and the owner of the resource
async function confirmUser(req, res, next) {
    console.log('confirm user...')
    try {
        console.log(req.params, req.body, req.url)
        if (req.originalUrl.includes('books')) {

            const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [req.url.slice(1)])
            
            if (bookResult.rows[0].user_id !== req.id) throw new Error('Access Denied')
        } 

        else if (req.originalUrl.includes('shelves')) {

            let shelfResult, bookcaseResult, roomResult;

            if (req.method === 'POST') {
                bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [req.url.slice(1)])
            } else {
                shelfResult = await pool.query('SELECT bookcase_id FROM shelves WHERE id = $1', [req.url.slice(1)])
                bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [shelfResult.rows[0].bookcase_id])
            }
            
            roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [bookcaseResult.rows[0].room_id])
            
            if (roomResult.rows[0].user_id !== req.id) throw new Error('Access Denied')
            console.log('OK. token-user-id: ' + req.id + ', resource-relation-id: ' + roomResult.rows[0].user_id)
        }

        else if (req.originalUrl.includes('bookcases')) {

            let bookcaseResult, roomResult;

            if (req.method === 'POST') {
                console.log('req.body: ', req.body)
                roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [req.body[0].room_id])
            } else {
                bookcaseResult = await pool.query('SELECT * FROM bookcases WHERE id = $1', [req.url.slice(1)])
                roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [bookcaseResult.rows[0].room_id])
            }
            
            if (roomResult.rows[0]?.user_id !== req.id) throw new Error('Access Denied')
            
            req.bookcase = bookcaseResult?.rows[0]
            console.log('OK. token-user-id: ' + req.id + ', resource-relation-id: ' + roomResult.rows[0].user_id)
        }

        else if (req.originalUrl.includes('rooms')) {
            const roomResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [req.params.id])
            
            if (roomResult.rows[0]?.user_id !== req.id) throw new Error('Access Denied')
        }

        next()

    } catch(err) {

        console.log(err.message)
        res.status(403).json({ error: err.message })

    }
}

module.exports = {
    confirmUser,
    authorize
}