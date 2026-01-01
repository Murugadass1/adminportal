const express = require('express');
const router = express.Router();
const { login, createUser } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', createUser); // In this app, register is more like "create user" by admin

module.exports = router;
