const express = require('express')
const router = express.Router()

const authCtrl = require('../controllers/authController')

router.get('/awaken', authCtrl.awake)
router.post('/login', authCtrl.login)

module.exports = router