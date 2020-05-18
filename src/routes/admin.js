const express = require('express')
const admin = express.Router()

admin.use(require('../middlewares/auth'))
admin.get('/', require('../controllers/admin'))

module.exports = admin