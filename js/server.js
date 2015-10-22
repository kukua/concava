var connect = require('connect')
var http = require('http')
var app = connect()
var port = 3000
var getRawBody = require('raw-body')
var ContextElement = require('./contextElement')
var ContextBrokerClient = require('./contextBrokerClient')
var convert = require('./convert')
var calibrate = require('./calibrate')
var validate = require('./validate')

// Connect to ContextBroker
var client = new ContextBrokerClient({
	url: 'http://context_broker:1026/v1',
	timeout: 5000,
})

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
		limit: '1mb',
	}, function (err, buffer) {
		if (err) return next(err)

		req.payload = buffer
		next()
	})
})

// Verify given payload
app.use(function (req, res, next) {
	if (req.payload.length) return next()

	res.writeHead(204)
	res.end('No binary payload provided.')
})

// Create ContextElement
app.use(function (req, res, next) {
	try {
		req.contextElement = new ContextElement(req.payload)
		next()
	} catch (err) {
		next(err)
	}
})

// Determine payload ID
app.use(function (req, res, next) {
	if (req.contextElement.getPayloadId()) return next()

	res.writeHead(400)
	res.end('Could not determine payload ID.')
})

// Determine payload mapping
app.use(function (req, res, next) {
	var el = req.contextElement

	client.getPayloadMappingById(el.getPayloadId(), function (err, mapping) {
		if (err) return next(err)

		el.setMapping(mapping)
		next()
	})
})

// Convert
app.use(function (req, res, next) {
	convert(req.contextElement, next)
})

// Calibrate
app.use(function (req, res, next) {
	calibrate(req.contextElement, next)
})

// Validate
app.use(function (req, res, next) {
	validate(req.contextElement, next)
})

// Debug: dump ContextElement
app.use(function (req, res, next) {
	var el = req.contextElement
	console.log(el.getData(), el.getMapping())
	next()
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
