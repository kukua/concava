import connect from 'connect'
import http from 'http'
import getRawBody from 'raw-body'
import SensorData from './SensorData'
import Converter from './Converter'
import Calibrator from './Calibrator'
import Validator from './Validator'
import StorageAdapter from './storage/Adapter'
import convertTypes from './types/convert'
import validateTypes from './types/validate'
var app = connect()

// Configuration
import config from '../config.js'

if ( ! (config.client instanceof StorageAdapter)) {
	console.warn('Client not a storage Adapter, ConCaVa might not function properly.')
}

// Add timestamp to request
app.use(function (req, res, next) {
	req.start = new Date()
	next()
})

// Verify request
var allowedMethods = ['HEAD', 'POST', 'PUT']

app.use(function (req, res, next) {
	if (req.url.indexOf('/v1/sensorData') === 0 && allowedMethods.indexOf(req.method) !== -1) {
		res.setHeader('Allow', 'HEAD, POST, PUT')
		res.setHeader('Accept', 'application/octet-stream')

		if (req.method === 'HEAD') return res.end('')
		if (req.headers['content-type'] !== 'application/octet-stream') {
			res.writeHead(400)
			res.end('Invalid content type.')
			return
		}
		return next()
	}

	res.writeHead(404)
	res.end('Not found.')
})

// Validate authentication header
app.use(function (req, res, next) {
	if ( ! req.headers['authorization']) {
		var err = new Error('Missing Authorization header.')
		err.statusCode = 401
		return next(err)
	}

	var token = req.headers['authorization'].replace('Token ', '')

	if ( ! token || ! token.match(/^[a-zA-Z0-9]{32}$/)) {
		var err = new Error('Invalid token.')
		err.statusCode = 401
		return next(err)
	}

	req.authToken = token
	next()
})

// Parse payload into buffer
app.use(function (req, res, next) {
	getRawBody(req, {
		length: req.headers['content-length'],
		limit: config.payloadMaxSize,
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
var validURL = /^\/v1\/sensorData\/([a-f0-9]{16})$/

app.use(function (req, res, next) {
	try {
		var deviceId, buffer = req.buffer

		if (req.method === 'POST') {
			// Extract device ID from buffer
			deviceId = buffer.toString('hex', 0, 8)
			buffer = buffer.slice(8)
		} else if (req.method === 'PUT') {
			// Get device ID from URL
			try {
				deviceId = req.url.match(validURL)[1]
			} catch (err) {}
		}

		req.data = new SensorData(deviceId, buffer)
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

// Set sensor metadata
app.use(function (req, res, next) {
	config.client.setSensorMetadata(req.authToken, req.data, next)
})

// Convert
app.use(function (req, res, next) {
	var converter = new Converter(convertTypes)

	converter.convert(req.data)
	next()
})

// Calibrate
app.use(function (req, res, next) {
	var calibrator = new Calibrator()

	calibrator.calibrate(req.data)
	next()
})

// Validate
app.use(function (req, res, next) {
	var validator = new Validator(validateTypes)

	validator.validate(req.data)
	next()
})

// Debug: dump sensor data
if (config.debug) {
	app.use(function (req, res, next) {
		console.log(Date.now(), req.data.toString())
		next()
	})
}

// Store sensor data
app.use(function (req, res, next) {
	config.client.insertSensorData(req.authToken, req.data, req.start, next)
})

// Return response
app.use(function (req, res, next) {
	res.end()
})

// Error handler
app.use(function (err, req, res, next) {
	console.error(err)
	if (err.stack) console.error(err.stack)

	var statusCode = (err.statusCode || 500)
	if (statusCode === 401) res.setHeader('WWW-Authenticate', 'Token')
	res.writeHead(statusCode)

	if (err instanceof Error) err = err.toString().replace(/^Error: /, '')

	if (statusCode === 500) {
		res.end('An internal server error occured.')
	} else {
		res.end(err || '')
	}
})

// Start server
http.createServer(app).listen(config.port)
console.log('Listening on', config.port)
