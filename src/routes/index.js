const express = require('express')
const index = express.Router()

index.get('/', require('../controllers/index'))

module.exports = index