export default (debug = true) => {
	return (req, res, next) => {
		if ( ! debug) return next()

		// Log sensor data
		console.log(new Date(), req.data.toString())
		next()
	}
}
