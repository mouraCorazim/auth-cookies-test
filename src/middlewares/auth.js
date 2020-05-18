const sessions = require('../data/sessions.json')

module.exports = (req, res, next) => {

    const logged = sessions.find(session => session.token === req.cookies.token)

    if(logged){

        return next()
    }
    
    return res.status(404).json({'message': 'Not logged user'})
}