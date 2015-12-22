import Store from 'jfs'

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
		console.log(meta)
		cb('Metadata retrieval not implemented.')
	})
}

export let storage = (req, config, data, cb) => {
	var deviceId = data.getDeviceId()
	var store = stores[deviceId]

	if ( ! store) store = stores[deviceId] = new Store(config.path + `/store.${deviceId}.json`)

	var point = data.getData()
	var timestamp = (new Date(point.timestamp).getTime() || req.start.getTime())

	store.save(timestamp, point, cb)
}
