const express = require('express')
const register = express.Router()

register.post('/', require('../controllers/register'))

module.exports = register