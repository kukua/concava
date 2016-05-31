export default (debug = true) => {
	return (req, res, next) => {
		if ( ! debug) return next()

		// Log sensor data
		req.log.debug({
			deviceId: req.data.getDeviceId(),
			data: req.data.getData()
		})
		next()
	}
}
