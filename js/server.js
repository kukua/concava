var connect = require('connect')
var http = require('http')
var app = connect()
var getRawBody = require('raw-body')
var SensorData = require('./SensorData')
var ContextBrokerClient = require('./ContextBrokerClient')
var Converter = require('./Converter')
var Calibrator = require('./Calibrator')
var Validator = require('./Validator')
var convertTypes = require('./types/convert')
var validateTypes = require('./types/validate')

function sendAuthResponse (res, body) {
	res.setHeader('WWW-Authenticate', 'Token')
	res.writeHead(401)
	res.end(body || '')
}

// Configuration
var debug = true
var port = 3000
var contextBroker = {
	url: 'http://concava:9001/v1',
	timeout: 5000,
}
var payloadMaxSize = '512kb'

// Add timestamp to request
app.use(function (req, res, next) {
	req.start = new Date()
	next()
})

// Verify request
app.use(function (req, res, next) {
	if (req.url === '/' && (req.method === 'HEAD' || req.method === 'POST')) {
		res.setHeader('Allow', 'HEAD, POST')
		res.setHeader('Accept', 'application/octet-stream')

		if (req.method === 'HEAD') return res.end('')
		if (req.headers['content-type'] !== 'application/octet-stream') {
			res.writeHead(400)
			res.end('Invalid content type.')
			return
		}
		if (req.method === 'POST') return next()
	}

	res.writeHead(404)
	res.end('Not found.')
})

// Validate authentication header
app.use(function (req, res, next) {
	if ( ! req.headers['authorization']) return sendAuthResponse(res, 'Missing Authorization header.')

	var token = req.headers['authorization'].replace('Token ', '')

	if ( ! token || ! token.match(/^[a-zA-Z0-9]{32}$/)) {
		return sendAuthResponse(res, 'Invalid token.')
	}

	req.authToken = token
	next()
})

// Setup client
app.use(function (req, res, next) {
	req.client = new ContextBrokerClient(contextBroker)
	req.client.setAuthToken(req.authToken)
	next()
})

// Parse payload into buffer
app.use(function (req, res, next) {
	getRawBody(req, {
		length: req.headers['content-length'],
		limit: payloadMaxSize,
	}, function (err, buffer) {
		if (err) return next(err)

		req.buffer = buffer
		next()
	})
})

// Verify given payload
app.use(function (req, res, next) {
	if (req.buffer.length) return next()

	res.writeHead(204)
	res.end('No binary payload provided.')
})

// Create SensorData instance
app.use(function (req, res, next) {
	try {
		req.data = new SensorData(req.buffer)
		next()
	} catch (err) {
		next(err)
	}
})

// Validate device ID
app.use(function (req, res, next) {
	if (req.data.getDeviceId()) return next()

	res.writeHead(400)
	res.end('Could not determine payload ID.')
})

// Retrieve sensor metadata
app.use(function (req, res, next) {
	req.client.getSensorMetadata(req.data.getDeviceId(), function (err, metadata) {
		if (err && err.statusCode === 401) return sendAuthResponse(res, 'Unauthorized token.')
		if (err) return next(err)

		req.data.setMetadata(metadata)
		next()
	})
})

// Convert
app.use(function (req, res, next) {
	var converter = new Converter(convertTypes)

	converter.convert(req.data, next)
})

// Calibrate
app.use(function (req, res, next) {
	var calibrator = new Calibrator()

	calibrator.calibrate(req.data, next)
})

// Validate
app.use(function (req, res, next) {
	var validator = new Validator(validateTypes)

	validator.validate(req.data, next)
})

// Debug: dump sensor data
if (debug) {
	app.use(function (req, res, next) {
		console.log(
			req.data.getDeviceId(),
			req.data.getData()
		)
		next()
	})
}

// Store sensor data
app.use(function (req, res, next) {
	req.client.insertSensorData(req.data, req.start, next)
})

// Return response
app.use(function (req, res, next) {
	res.end()
})

// Error handler
app.use(function (err, req, res, next) {
	console.error(err)
	if (err.stack) console.error(err.stack)
	if (err instanceof Error) err = err.toString()
	res.writeHead(500)
	res.end(err || '')
	next()
})

// Start server
http.createServer(app).listen(port)
console.log('Listening on', port)
