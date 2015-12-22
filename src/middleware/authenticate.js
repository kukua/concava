export default (config) => {
	if ( ! config.enabled) return (req, res, next) => { next() }

	var header = (config.header || 'Authorization').toLowerCase()
	var tokenLength = 32
	var tokenRegExp = new RegExp(`^Token ([a-zA-Z0-9]{${tokenLength}})$`)

	return (req, res, next) => {
		var value = req.headers[header]
		var err
		req.auth = { header: value }

		if ( ! req.auth.header) {
			err = new Error(`Missing ${config.header} header.`)
			err.statusCode = 401
			return next(err)
		}

		if (config.byToken) {
			var token = value.replace(tokenRegExp, '$1')

			if (token.length !== tokenLength) {
				err = new Error('Invalid token.')
				err.statusCode = 401
				return next(err)
			}

			req.auth.token = token
		}

		if ( ! config.method) return next()

		config.method(req, config, req.data, (err, user) => {
			if (err) {
				err = new Error(err)
				err.statusCode = 401
				return next(err)
			}

			req.user = user
			next()
		})
	}
}
