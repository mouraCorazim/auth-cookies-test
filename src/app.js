const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use('/', require('./routes/index'))
app.use('/admin', require('./routes/admin'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/login'))

module.exports = app