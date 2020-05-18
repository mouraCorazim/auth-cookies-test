const app = require('./src/app')
const port = 8000

global.__rootname = __dirname

app.listen(port, () => console.log('listening on port: ' + port))