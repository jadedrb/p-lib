require('dotenv').config()

const Pool = require('pg').Pool

let initialConnection = {
    connected: false,
    connections: 0
}

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

pool.on('connect', () => {
    if (!initialConnection.connected) {
        initialConnection.connected = true
        setTimeout(() => console.log(initialConnection), 1000)
    }
    initialConnection.connections++
})

pool.on('error', (error, client) => {
    console.log('ERROR: ', error)
})

module.exports = pool


// module.exports = {
//     development: {
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         host: process.env.DB_HOST,
//         dialect: 'postgres'
//     },
//     production: {
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         host: process.env.DB_HOST,
//         dialect: 'postgres'
//     }
// }