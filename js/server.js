var connect = require('connect')
var http = require('http')
var app = connect()
var port = 3000
var getRawBody = require('raw-body')
var binary = require('binary')

// Define method for authentication mocking
function getUserByToken (token, cb) {
	if (token === 'test') {
		var user = {
			id: 1,
		}
		return cb(null, user)
	}

	cb('No user for token.')
}

// Define method for determining metadata by payload ID
function getMetadataByPayloadId (id, cb) {
	cb(null, [
		{
			name: 'attr1',
			type: 'integer',
			length: 4,
		},
	])
}

// Define ContextElement class
function ContextElement (data, metadata) {
	this.data = data
	this.metadata = metadata
}

ContextElement.prototype.getValue = function (name) {
	return this.data[name]
}

// Verify request method
app.use(function (req, res, next) {
	if (req.method === 'POST') return next()

	res.writeHead(404)
	res.end('Not found.')
})

// Authenticate request
app.use(function (req, res, next) {
	getUserByToken(req.headers['x-auth-token'], function (err, user) {
		if (err)  {
			res.writeHead(401)
			res.end('Invalid X-Auth-Token.')
			return
		}

		req.user = user
		next()
	})
})

// Parse payload into buffer
app.use(function (req, res, next) {
	getRawBody(req, {
		length: req.headers['content-length'],
		limit: '1mb',
	}, function (err, buffer) {
		if (err) return next(err)

		req.payload = { buffer: buffer }
		next()
	})
})

// Verify that payload is given
app.use(function (req, res, next) {
	if (req.payload.buffer.length) return next()

	res.writeHead(204)
	res.end('No binary payload provided.')
})

// Determine payload ID
app.use(function (req, res, next) {
	var parser = binary.parse(req.payload.buffer)

	req.payload.parser = parser
	req.payload.id = parser.word64bu('id').vars.id

	if (req.payload.id) return next()

	res.writeHead(400)
	res.end('Could not determine payload ID.')
})

// Determine payload metadata
app.use(function (req, res, next) {
	getMetadataByPayloadId(req.payload.id, function (err, metadata) {
		if (err) return next(err)

		req.payload.metadata = metadata
		next()
	})
})

// Parse payload
app.use(function (req, res, next) {
	var parser = req.payload.parser
	var metadata = req.payload.metadata

	for (var i in metadata) {
		var attr = metadata[i]
		var size = null
		var bigEndian = true
		var signed = false

		if (attr.type === 'integer') {
			size = attr.length * 8
			signed = true
		} else {
			return next('Unsupported data type ' + attr.type)
		}

		var method = 'word' + size + (bigEndian ? 'b' : 'l') + (signed ? 's' : 'u')

		if (typeof parser[method] !== 'function') {
			return next('Unsuported binary parser method ' + method)
		}

		parser[method](attr.name)
	}

	req.payload.data = parser.vars

	next()
})

// Create ContextElement
app.use(function (req, res, next) {
	try {
		req.contextElement = new ContextElement(req.payload.data, req.payload.metadata)
		next()
	} catch (e) {
		next(e)
	}
})

// Debug: dump ContextElement
app.use(function (req, res, next) {
	console.log(req.contextElement)
	next()
})

// Return response
app.use(function (req, res, next) {
	res.end()
})

// Error handler
app.use(function (err, req, res, next) {
	res.writeHead(500)
	res.end(err || undefined)
	next()
})

// Start server
http.createServer(app).listen(port)
console.log('Listening on', port)
