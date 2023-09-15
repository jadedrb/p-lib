const express = require('express')
const router = express.Router()

const bookCtrl = require('../controllers/bookController')

router.get('/search', bookCtrl.show)
router.get('/:id/coord', bookCtrl.coord)
router.get('/:category/count', bookCtrl.count)

router.put('/:id', bookCtrl.update)

router.post('/:id', bookCtrl.create)

module.exports = router