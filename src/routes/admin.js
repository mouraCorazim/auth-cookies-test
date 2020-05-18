const express = require('express')
const cookieParser = require('cookie-parser')
const admin = express.Router()

admin.use(cookieParser())
admin.use(require('../middlewares/auth'))
admin.get('/', require('../controllers/admin'))

module.exports = admin