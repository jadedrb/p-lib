const express = require('express')
const app = express()

const cors = require('cors')
const PORT = 8080

require('dotenv').config()

app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const roomRoutes = require('./routes/roomRoutes')
const bookRoutes = require('./routes/bookRoutes')
const shelfRoutes = require('./routes/shelfRoutes')

const { authorize } = require('./middleware/authMiddleware')

app.use('/auth', authRoutes)
app.use('/api/users', authorize, userRoutes)
app.use('/api/rooms', authorize, roomRoutes)
app.use('/api/books', authorize, bookRoutes)
app.use('/api/shelves', authorize, shelfRoutes)

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT)
})