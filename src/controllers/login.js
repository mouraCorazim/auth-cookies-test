const crypto = require('crypto')
const fs = require('fs')
const users = require('../data/users.json')
const sessions = require('../data/sessions.json')
const secret = require('../config/secret')

module.exports = (req, res) => {

    const email = req.body.email
    const password = crypto.createHash('sha256').update(req.body.password).digest('base64')
    const user = users.find(user => user.email === email && user.password === password)

    if(user){

        if(user.active){

            const validSession = sessions.find(session => session.token === req.cookies.token && session.user === user.email)

            if(validSession){
        
                return res.status(200).json({'message': 'token stay valid'})
            }

            const token = crypto.createHash('sha256')
                               .update(user.email+secret.key+Date.now())
                               .digest('base64')
    
            const expires = new Date(Date.now() +(5000*100))

            sessions.push({'user': user.email, 'token': token, 'expires': expires})
    
            fs.writeFile(__rootname + '/src/data/sessions.json', JSON.stringify(sessions), err => err? console.error(err): 0)
    
            return res.cookie('token', `${token}`)
                      .status(200)
                      .json({'message': 'user was logged'})
        }

        return res.status(404).json({'message': 'user inactive'})
    }

    return res.status(404).json({'message': 'user do not exists'})
}