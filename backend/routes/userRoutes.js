const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/userController')

router.get('/test', userCtrl.test)
router.get('/overview', userCtrl.overview)
router.get('/:username', userCtrl.show)

module.exports = router