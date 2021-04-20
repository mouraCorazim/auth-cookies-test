const app = require('./src/app')
const port = 8000
const listeningMessage = 'listening on port: ' + port
const cb = message => () => console.log(message)

global.__rootname = __dirname

app.listen(port, cb(listeningMessage))
