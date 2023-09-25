const express = require('express')
const router = express.Router()

const roomCtrl = require('../controllers/roomController')

router.get('/', roomCtrl.index)
router.post('/', roomCtrl.create)
router.put('/:id', roomCtrl.update)
router.delete('/:id', roomCtrl.destroy)

module.exports = router