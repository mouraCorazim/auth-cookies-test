const crypto = require('crypto')
const fs = require('fs')
const users = require('../data/users.json')
const User = require('../models/User')

function isValidCode(code) {
    return code > 99 && code < 520
}

function isValidMessage(message){
    return message != ""
}

function status(code, message){
    return isValidMessage(message) && isValidCode(code)?
            {'status': code, 'message': message} : {}
}

function Register(obj = {}){
    return {
        'obj': obj,
        'isValid': () => this.base && this.data && this.status
        'base': (base) => base? Register({'base': base, ... this.obj}): Register(),
        'of': (data) => data? Register({'data': data, ... this.obj}): Register(),
        'status': (status) => status? Register({'status': status, ... this.obj}): Register(),
        'chain': (fn) => fn && this.isValid()? fn(this.obj): Register()
    }
}

function registerUser(register){
    const filePath = __rootname + '/src/data/users.json'
    const data = [... register.base, register.data]
    const toWrite = JSON.stringify(data)
    const callback = err => err? console.error(err): console.log("Registered user")

    fs.writeFile(filePath, toWrite, callback)

    return res.status(register.status.code) // 201
              .json(register.status.message) // Registered user
}

module.exports = (req, res) => {

    const userEmail = req.body.email
    const userPassword = crypto.createHash('sha256')
                               .update(req.body.password)
                               .digest('base64')

    if(!userEmail || !userPassword){
        return res.status(400)
                  .json({'message': 'missing arguments on request body'})   
    }
        
    const userExists = users.find(user => user.email === userEmail)

    if(userExists){
        return res.status(403)
                  .json({'message': 'User already exists'})
    }
    
    if(userEmail && userPassword && !userExists){
        return Register().of(User(userEmail, userPassword))
                         .base(users)
                         .status(status(201, "Registered user))
                         .chain(registerUser)
    }
}
