import handleAdapter from '../handleAdapter'

export default (config) => {
	if ( ! config.enabled) return (req, res, next) => { next() }

	var header = (config.header || 'Authorization').toLowerCase()
	var tokenLength = 32
	var tokenRegExp = new RegExp(`^Token ([a-zA-Z0-9]{${tokenLength}})$`)

	return (req, res, next) => {
		var err

		req.auth = {
			udid: req.data.getDeviceId()
		}

		if (header) {
			var value = req.auth.header = req.headers[header]

			if ( ! value) {
				err = new Error(`Missing ${config.header} header.`)
				err.statusCode = 401
				return next(err)
			}

			if (config.byToken !== false) {
				var token = value.replace(tokenRegExp, '$1')

				if (token.length !== tokenLength) {
					err = new Error('Invalid token.')
					err.statusCode = 401
					return next(err)
				}

				req.auth.token = token
			}
		}

		handleAdapter(req, config, next, (err, user) => {
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
