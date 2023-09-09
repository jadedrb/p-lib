const express = require('express')
const router = express.Router()

const roomCtrl = require('../controllers/roomController')

router.get('/:username', roomCtrl.index)

module.exports = router