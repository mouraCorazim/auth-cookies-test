const crypto = require('crypto')
const fs = require('fs')
const database = require('../data/users.json')
const sessions = require('../data/sessions.json')
const secret = require('../config/secret')

module.exports = (req, res) => {

    const email = req.body.email
    const password = crypto.createHash('sha256').update(req.body.password).digest('base64')
    const user = database.find(user => user.email === email && user.password === password)

    if(user.active){

        const token = crypto.createHash('sha256')
                           .update(user.email+secret.key+Date.now())
                           .digest('base64')

        const session = sessions.find(session => session.user === user.email)
        const expires = new Date(Date.now() +(5000*100))

        if(session){

            if(new Date(session.expires).getTime() > new Date(Date.now()).getTime()){
    
                return res.status(200).json({'message': 'token stay valid'})
            }  
        }

        sessions.push({'user': user.email, 'token': token, 'expires': expires})

        fs.writeFile(__rootname + '/src/data/sessions.json', JSON.stringify(sessions), err => console.error(err))

        return res.cookie('token', `${token}`)
                  .status(200)
                  .json({'message': 'user was logged'})
    }

    return res.status(404).json({'message': 'user do not exists'})
}