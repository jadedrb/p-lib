const express = require('express')
const router = express.Router()

const bookcaseCtrl = require('../controllers/bookcaseController')

router.put('/:id', bookcaseCtrl.update)
router.post('/', bookcaseCtrl.create)

module.exports = router