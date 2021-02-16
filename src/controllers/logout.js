const fs = require('fs')
const sessions = require('../data/sessions.json')

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

function checkSession(session = false){
    return session?
        status(200, "User logout"): status(404, "Not logged User")
}

function Session(obj = {}){
    return {
        'value': obj,
        'isValid': () => this.value.token && this.value.base && this.value.status,
        'of': (token) => token? Session({'token': token, ... this.value}): Session(),
        'base': (base) => base? Session({'base': base, ... this.value}): Session(),
        'status': (status) => status? Session({'status': status, ... this.value}): Session(),
        'chain': (fn) => fn && this.isValid()? fn(this.value): Session()
    }
}

function closeSession(res){
    return function(session){
        const values = session.value
        const sessionsPath = __rootname + '/src/data/sessions.json'
        const persistSessions = values.base.filter(session => session.token !== values.token)
        const toWrite = JSON.stringify(persistSessions)
        const callback = err => err? console.error(err): 0

        fs.writeFile(sessionsPath, toWrite, callback)

        return res.clearCookie('token')
                  .status(values.status.code)
                  .json(values.status.message)
    }
}

module.exports = (req, res) => {
    
    const token = req.cookies.token
    const session = sessions.find(session => session.token === req.cookies.token)
    const status = checkSession(session)
    
    return session?
        Session().of(token)
                 .base(sessions)
                 .status(status)
                 .chain(closeSession(res))
        : 
        res.status(status.code)
           .json(status.message)
}
