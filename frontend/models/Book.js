const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
    title: String,
    author: String,
    type: String,
    genre: String,
    location: String,
    shelf: String,
    user: String,
})

module.exports = mongoose.model('Books', BookSchema)