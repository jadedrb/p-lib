const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/userController')

router.get('/test', userCtrl.test)
router.get('/:username', userCtrl.show)

module.exports = router