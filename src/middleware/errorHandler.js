export default (byToken) => {
	return (err, req, res, next) => {
		// Log
		var info = { stack: err.stack }
		if (req.data) {
			info.deviceId = req.data.getDeviceId()
			info.data = req.data.getData()
		} else if (req.buffer) {
			info.buffer = req.buffer
		}
		req.log.error(info, '' + err)

		// Set response status code
		var statusCode = (err.statusCode || 500)
		if (statusCode === 401 && byToken) res.setHeader('WWW-Authenticate', 'Token')
		res.writeHead(statusCode)

		// Output error message
		if (err instanceof Error) err = err.toString().replace(/^Error: /, '')

		if (statusCode === 500) {
			res.end('An internal server error occured.')
		} else {
			res.end(err || '')
		}

		next()
	}
}
