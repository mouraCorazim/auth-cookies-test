const sessions = require('../data/sessions.json')
const users = require('../data/users.json')

module.exports = (req, res) => {

    const session = sessions.find(session => session.token === req.cookies.token)
    const user = users.find(user => user.email === session.user)
    const {email, created} = user


    return res.status(200).json({'message': {'user': email, 'created': created}})
}