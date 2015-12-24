export default (config) => {
	return (req, res, next) => {
		config.method(req, config, req.data, (err) => {
			if (err) {
				err = new Error(err)
				err.statusCode = 400
			}
			next(err)
		})
	}
}
