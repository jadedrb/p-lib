const express = require('express')
const router = express.Router()

const roomCtrl = require('../controllers/roomController')

router.get('/', roomCtrl.index)

module.exports = router