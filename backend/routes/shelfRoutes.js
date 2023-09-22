const express = require('express')
const router = express.Router()

const shelfCtrl = require('../controllers/shelfController')

router.put('/:id', shelfCtrl.update)

module.exports = router