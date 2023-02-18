const express = require('express'); //import express

const router = express.Router();

const userController = require('../controllers/token'); //import controller

router.post('/token', userController.verifyToken); 

//router.get('/token', userController.generateToken);


module.exports = router;