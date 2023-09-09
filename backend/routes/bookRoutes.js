const express = require('express')
const router = express.Router()

const bookCtrl = require('../controllers/bookController')

router.get('/search', bookCtrl.show)
router.get('/:id/coord', bookCtrl.coord)

module.exports = router