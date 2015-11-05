var connect = require('connect')
var http = require('http')
var app = connect()
var getRawBody = require('raw-body')
var ContextElement = require('./contextElement')
var ContextBrokerClient = require('./contextBrokerClient')
var convert = require('./convert')
var calibrate = require('./calibrate')
var validate = require('./validate')

var buffer, contextElement

// Configuration
var debug = true
var port = 3000
var contextBroker = {
	url: 'http://context_broker:1026/v1',
	timeout: 5000,
}
var payloadMaxSize = '512kb'

// Connect to ContextBroker
var client = new ContextBrokerClient(contextBroker)

// Verify request method
app.use(function (req, res, next) {
	if (req.method === 'POST') return next()

	res.writeHead(404)
	res.end('Not found.')
})

// Parse payload into buffer
app.use(function (req, res, next) {
	getRawBody(req, {
		length: req.headers['content-length'],
		limit: payloadMaxSize,
	}, function (err, buf) {
		if (err) return next(err)

		buffer = buf
		next()
	})
})

// Verify given payload
app.use(function (req, res, next) {
	if (buffer.length) return next()

	res.writeHead(204)
	res.end('No binary payload provided.')
})

// Create ContextElement
app.use(function (req, res, next) {
	try {
		contextElement = new ContextElement(buffer)
		next()
	} catch (err) {
		next(err)
	}
})

// Determine payload ID
app.use(function (req, res, next) {
	if (contextElement.getDeviceId()) return next()

	res.writeHead(400)
	res.end('Could not determine payload ID.')
})

// Determine payload mapping
app.use(function (req, res, next) {
	client.getPayloadMappingById(contextElement.getDeviceId(), function (err, mapping) {
		if (err) return next(err)

		contextElement.setMapping(mapping)
		next()
	})
})

// Convert
app.use(function (req, res, next) {
	convert(contextElement, next)
})

// Calibrate
app.use(function (req, res, next) {
	calibrate(contextElement, next)
})

// Validate
app.use(function (req, res, next) {
	validate(contextElement, next)
})

// Debug: dump ContextElement
if (debug) {
	app.use(function (req, res, next) {
		console.log(
			contextElement.getDeviceId(),
			contextElement.getData(),
			contextElement.getMapping()
		)
		next()
	})
}

// Send to Context Broker
app.use(function (req, res, next) {
	client.insertContextElement(contextElement, next)
})

// Return response
app.use(function (req, res, next) {
	res.end()
})

// Error handler
app.use(function (err, req, res, next) {
	console.error(err, err.stack)
	if (err instanceof Error) err = err.toString()
	res.writeHead(500)
	res.end(err || '')
	next()
})

// Start server
http.createServer(app).listen(port)
console.log('Listening on', port)
