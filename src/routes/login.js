const express = require('express')
const login = express.Router()

login.post('/', require('../controllers/login'))

module.exports = login