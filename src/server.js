import http from 'http'
import connect from 'connect'
import bunyan from 'bunyan'
import verifyRequest from './middleware/verifyRequest'
import parsePayload from './middleware/parsePayload'
import createSensorData from './middleware/createSensorData'
import authenticate from './middleware/authenticate'
import setMetadata from './middleware/setMetadata'
import { convert, calibrate, validate } from './middleware/concava'
import debug from './middleware/debug'
import store from './middleware/store'
import errorHandler from './middleware/errorHandler'

const app = connect()

// Configuration
import config from '../config.js'

const port = (parseInt(config.port) || 3000)

// Logger
const logFile = (config.logFile || '/tmp/output.log')
const log = bunyan.createLogger({
	name: (config.logName || 'concava'),
	streams: [
		{ level: 'warn', stream: process.stdout },
		{ level: (config.debug ? 'debug' : 'info'), path: logFile }
	]
})

// Exception handling
process.on('uncaughtException', (err) => {
	log.error({ type: 'uncaught-exception', stack: err.stack }, '' + err)
})

// Add timestamp and logger to request
app.use((req, res, next) => {
	req.start = new Date()
	req.log = log
	next()
})

app.use(verifyRequest())
app.use(parsePayload())
app.use(createSensorData())
app.use(authenticate(config.auth || {}))
app.use(setMetadata(config.metadata))
app.use(convert())
app.use(calibrate())
app.use(validate())
app.use(debug(config.debug))
app.use(store(config.storage))
app.use(errorHandler(config.auth.byToken))

// End request
app.use((req, res, next) => {
	res.end()
	next()
})

// Start server
http.createServer(app).listen(port)
log.info(`Listening on port ${port}.`)
