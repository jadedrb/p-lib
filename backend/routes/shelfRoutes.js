const express = require('express')
const router = express.Router()

const shelfCtrl = require('../controllers/shelfController')

router.put('/:id', shelfCtrl.update)
router.post('/:bookcase_id', shelfCtrl.create)
router.delete('/:id', shelfCtrl.destroy)

module.exports = router