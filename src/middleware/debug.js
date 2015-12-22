export default (debug = true) => {
	return (req, res, next) => {
		if ( ! debug) return next()

		// Log sensor data
		console.log(Date.now(), req.data.toString())
		next()
	}
}
