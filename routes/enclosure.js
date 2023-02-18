const express = require('express')

const router = express.Router()

const enclosureController = require('../controllers/enclosure')

router.post('/enclosure/:userid', enclosureController.newEnclosure)

router.get('/enclosure', enclosureController.getAllEnclosure)

router.get('/enclosure/:id', enclosureController.getEnclosureById)

router.delete('/enclosure/:id', enclosureController.deleteEnclosure)

router.get('/enclosure/user/:userid', enclosureController.getAllEnclosureByUser)

router.put('/enclosure/share', enclosureController.shareEnclosure)

router.get('/enclosure/search/:id', enclosureController.serchEnclosure);

module.exports = router

