import Store from 'jfs'
import SensorAttribute from '../SensorAttribute'

var tokens, meta, stores = {}

export let auth = (req, config, data, cb) => {
	if ( ! tokens) tokens = new Store(config.file)

	tokens.get(req.auth.token, (err, user) => {
		if (err || ! user) return cb('Unauthorized token.')
		cb(null, user)
	})
}

export let metadata = (req, config, data, cb) => {
	if ( ! meta) meta = new Store(config.file)

	meta.get(data.getDeviceId(), (err, meta) => {
		if (err || ! meta) return cb(`No metadata for ${data.getDeviceId()}.`)

		var attributes = meta.map((info) => {
			var attr = new SensorAttribute(info.name)

			info.converters.forEach((conv) => {
				var type = conv, value
				if (Array.isArray(conv)) [ type, value ] = conv
				attr.addConverter(type, value)
			})

			info.calibrators.forEach((fn) => attr.addCalibrator(new Function('val', fn)))

			info.validators.forEach((val) => {
				var type = val, value
				if (Array.isArray(val)) [ type, value ] = val
				attr.addValidator(type, value)
			})

			return attr
		})

		data.setAttributes(attributes)
		cb()
	})
}

export let storage = (req, config, data, cb) => {
	var deviceId = data.getDeviceId()
	var store = stores[deviceId]

	if ( ! store) store = stores[deviceId] = new Store(config.path + `/store.${deviceId}.json`)

	var point = data.getData()
	point.timestamp = (new Date(point.timestamp).getTime() || req.start.getTime())

	store.save(point, cb)
}
