const crypto = require('crypto')
const fs = require('fs')
const users = require('../data/users.json')
const User = require('../models/User')

module.exports = (req, res) => {

    const userEmail = req.body.email
    const userPassword = crypto.createHash('sha256').update(req.body.password).digest('base64')

    if(!userEmail || !userPassword){
        return res.status(400).json({'message': 'missing arguments on request body'})   
    }
        
    const userExists = users.find(user => user.email === userEmail)

    if(userExists){
        return res.status(403).json({'message': 'User already exists'})
    }

    users.push(User(userEmail, userPassword))

    fs.writeFile(__rootname + '/src/data/users.json', JSON.stringify(users), err => err? console.error(err): 0)

    return res.status(201).json({'message': 'User registered'})
}
