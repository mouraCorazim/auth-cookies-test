const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use('/', require('./routes/index'))
app.use('/admin', require('./routes/admin'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))
app.use('/logout', require('./routes/logout'))

module.exports = app