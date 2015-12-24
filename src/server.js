import connect from 'connect'
import http from 'http'
import verifyRequest from './middleware/verifyRequest'
import parsePayload from './middleware/parsePayload'
import createSensorData from './middleware/createSensorData'
import authenticate from './middleware/authenticate'
import setMetadata from './middleware/setMetadata'
import { convert, calibrate, validate } from './middleware/concava'
import debug from './middleware/debug'
import store from './middleware/store'
import errorHandler from './middleware/errorHandler'

var app = connect()

// Configuration
import config from '../config.js'

// Add timestamp to request
app.use((req, res, next) => {
	req.start = new Date()
	next()
})

app.use(verifyRequest())
app.use(parsePayload())
app.use(createSensorData())
app.use(authenticate(config.auth))
app.use(setMetadata(config.metadata))
app.use(convert())
app.use(calibrate())
app.use(validate())
app.use(debug(config.debug))
app.use(store(config.storage))
app.use(errorHandler(config.auth.byToken))

// End request
app.use((req, res, next) => { res.end() })

// Start server
http.createServer(app).listen(config.port)
console.log('Listening on', config.port)
