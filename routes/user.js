const express = require('express'); //import express

const router = express.Router();

const userController = require('../controllers/user');

router.post('/user', userController.newUser)

router.get('/user', userController.getAllUser)

router.post('/user/login', userController.login)

router.delete('/user/:id', userController.deleteUser)

router.get('/user/:id', userController.getUserById)

module.exports = router;