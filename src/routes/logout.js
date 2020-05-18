const express = require('express')
const logout = express.Router()

logout.get('/', require('../controllers/logout'))

module.exports = logout