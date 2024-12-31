const jwt = require('jsonwebtoken')
const pool = require('../config')

// check the token for authorization
function authorize(req, res, next) {
    console.log(req.method + ' ' + req.originalUrl)
    // console.log(token)
    
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
        res.status(403).json({ error: err })

    }
}

// check the user and the owner of the resource
async function confirmUser(req, res, next) {
    console.log('confirm user...')
    try {

        let mainResult;

        if (req.originalUrl.includes('books')) {

            if (req.method === 'POST') {
                // make sure all non-book ids provided in the req.body are related 
                // and that the chain ends with the correct user
                const shelvesResult = await pool.query('SELECT bookcase_id FROM shelves WHERE id = $1', [req.body[0].shid])
                if (shelvesResult?.rows?.[0].bookcase_id != req.body[0].bcid) throw new Error('Access Denied')
                const bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [req.body[0].bcid])
                if (bookcaseResult?.rows?.[0].room_id != req.body[0].rid) throw new Error('Access Denied')
                mainResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [req.body[0].rid])

            } else if (req.method === 'DELETE') {
                mainResult = await pool.query('SELECT user_id FROM books WHERE id = $1', [req.url.slice(1)])

            } else if (req.method === 'PUT') {
                mainResult = await pool.query('SELECT * FROM books WHERE id = $1', [req.url.slice(1)])
                req.book = mainResult?.rows?.[0]
            } else {
                return next()
            }
    
        } 

        else if (req.originalUrl.includes('shelves')) {

            let shelfResult, bookcaseResult;

            if (req.method === 'POST') {
                bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [req.url.slice(1)])
            } else {
                shelfResult = await pool.query('SELECT bookcase_id FROM shelves WHERE id = $1', [req.url.slice(1)])
                bookcaseResult = await pool.query('SELECT room_id FROM bookcases WHERE id = $1', [shelfResult.rows[0].bookcase_id])
            }
            
            mainResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [bookcaseResult.rows[0].room_id])
            
        }

        else if (req.originalUrl.includes('bookcases')) {

            let bookcaseResult;

            if (req.method === 'POST') {
                console.log('req.body: ', req.body)
                mainResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [req.body[0].room_id])
            } else {
                bookcaseResult = await pool.query('SELECT * FROM bookcases WHERE id = $1', [req.url.slice(1)])
                mainResult = await pool.query('SELECT user_id FROM rooms WHERE id = $1', [bookcaseResult.rows[0].room_id])
            }
            
            req.bookcase = bookcaseResult?.rows[0]
        }

        else if (req.originalUrl.includes('rooms')) {
            if (req.method === 'PUT' || req.method === 'DELETE') {
                mainResult = await pool.query('SELECT * FROM rooms WHERE id = $1', [req.url.slice(1)])
    
            } else {
                console.log('here:')
                return next()
            }
            
            req.room = mainResult?.rows[0]
        }

        if (mainResult.rows?.[0].user_id != req.id) throw new Error('Access Denied')
        console.log('OK. token-user-id: ' + req.id + ', resource-relation-id: ' + mainResult.rows[0].user_id)
        
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