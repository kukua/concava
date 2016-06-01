import getRawBody from 'raw-body'

export default (limit) => {
	limit = (limit || '512kb')

	return (req, res, next) => {
		// Parse payload into buffer
		getRawBody(req, {
			length: req.headers['content-length'],
			limit,
		}, function (err, buffer) {
			if (err) return next(err)

			if (buffer.length) {
				req.buffer = buffer
				return next()
			}

			res.writeHead(400)
			res.end('No binary payload provided.')
		})
	}
}
