export default (byToken) => {
	return (err, req, res, next) => {
		console.error(err)
		if (err.stack) console.error(err.stack)

		var statusCode = (err.statusCode || 500)
		if (statusCode === 401 && byToken) res.setHeader('WWW-Authenticate', 'Token')
		res.writeHead(statusCode)

		if (err instanceof Error) err = err.toString().replace(/^Error: /, '')

		if (statusCode === 500) {
			res.end('An internal server error occured.')
		} else {
			res.end(err || '')
		}
		next()
	}
}
