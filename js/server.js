var connect = require('connect')
var http = require('http')
var app = connect()
var port = 3000
var getRawBody = require('raw-body')
var ContextElement = require('./contextElement')
var convert = require('./convert')
var calibrate = require('./calibrate')
var validate = require('./validate')

// Define method for determining metadata by payload ID
function getMetadataByPayloadId (id, cb) {
	cb(null, [
		{
			name: 'attr1',
			type: 'integer',
			length: 4,
			metadatas: [
				{
					name: 'min',
					type: 'integer',
					value: 100,
				},
				{
					name: 'max',
					type: 'integer',
					value: 1300,
				},
				{
					name: 'calibrate',
					type: 'function',
					value: 'function (a) { return a - 58.3; }',
				},
			],
		},
	])
}

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

// Determine payload metadata
app.use(function (req, res, next) {
	var el = req.contextElement

	getMetadataByPayloadId(el.getPayloadId(), function (err, metadata) {
		if (err) return next(err)

		el.setMetadata(metadata)
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
	console.log(el.getData())
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
