export default () => {
	var allowedMethods = ['HEAD', 'POST', 'PUT']

	return (req, res, next) => {
		if ((req.url === '/measurements'
			|| req.url.indexOf('/measurements/') === 0
			|| req.url === '/data'
			|| req.url.indexOf('/data/') === 0
			|| req.url === '/sensorData' // Deprecated
			|| req.url.indexOf('/sensorData/') === 0 // Deprecated
			)
			&& allowedMethods.indexOf(req.method) !== -1) {
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
	}
}
