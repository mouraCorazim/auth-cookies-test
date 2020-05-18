const crypto = require('crypto')
const fs = require('fs')
const database = require('../data/users.json')
const User = require('../models/User')

module.exports = (req, res) => {

    const userEmail = req.body.email
    const userPassword = crypto.createHash('sha256').update(req.body.password).digest('base64')

    if(userEmail && userPassword){
        
        const userExists = database.find(user => user.email === userEmail)

        if(!userExists){

            database.push(User(userEmail, userPassword))
    
            fs.writeFile(__rootname + '/src/data/users.json', JSON.stringify(database), err => console.error(err))
    
            return res.status(200).json({'message': 'User registered'})
        }

        return res.status(403).json({'message': 'User already exists'})
    }

    return res.status(400).json({'message': 'missing arguments on request body'})
}