import SensorData from '../SensorData'

export default () => {
	var validURL = /^\/sensorData\/([a-f0-9]{16})$/

	return (req, res, next) => {
		try {
			var deviceId, buffer = req.buffer

			if (req.method === 'POST') {
				// Extract device ID from buffer
				deviceId = buffer.toString('hex', 0, 8)
				buffer = buffer.slice(8)
			} else if (req.method === 'PUT') {
				// Get device ID from URL
				try {
					deviceId = req.url.match(validURL)[1]
				} catch (err) {
					// Do nothing
				}
			}

			req.data = new SensorData(deviceId, buffer)

			if (req.data.getDeviceId()) return next()

			res.writeHead(400)
			res.end('Could not determine payload ID.')
		} catch (err) {
			next(err)
		}
	}
}
