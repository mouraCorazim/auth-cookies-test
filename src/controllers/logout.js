const fs = require('fs')
const sessions = require('../data/sessions.json')

module.exports = (req, res) => {

    const session = sessions.find(session => session.token === req.cookies.token)

    if(session){

        const persistSessions = sessions.filter(session => session.token !== req.cookies.token)
    
        fs.writeFile(__rootname+'/src/data/sessions.json', JSON.stringify(persistSessions), err => err? console.error(err): 0)
    
        return res.clearCookie('token')
                .status(200)
                .json({'message': 'User logout'})
    }

    return res.status(404).json({'message': 'Not logged User'})
}