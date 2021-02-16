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
        'obj': obj,
        'isValid': () => this.obj.token && this.obj.base && this.obj.status,
        'of': (token) => token? Session({'token': token, ... this.obj}): Session(),
        'base': (base) => base? Session({'base': base, ... this.obj}): Session(),
        'status': (status) => status? Session({'status': status, ... this.obj}): Session(),
        'chain': (fn) => fn && this.isValid()? fn(this.obj): Session()
    }
}

function closeSession(sessions, status, token){
    const sessionsPath = __rootname + '/src/data/sessions.json'
    const persistSessions = sessions.filter(session => session.token !== token)
    const toWrite = JSON.stringify(persistSessions)
    const callback = err => err? console.error(err): 0

    fs.writeFile(sessionsPath, toWrite, callback)

    return res.clearCookie('token')
              .status(status.code)
              .json(status.message)
}

function notSession(status){
    return res.status(status.code)
              .json(status.message)
}

module.exports = (req, res) => {
    
    const token = req.cookies.token
    const session = sessions.find(session => session.token === req.cookies.token)
    const status = checkSession(session)
    
    return session?
        closeSession(sessions, status, token): notSession(status)
}
