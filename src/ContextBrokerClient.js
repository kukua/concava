import request from 'request'
import SensorData from './SensorData'
import SensorMetadata from './SensorMetadata'

export default class ContextBrokerClient {
	constructor (config) {
		this.setConfig(config || {})
		this._cache = {}
	}
	setConfig (config) {
		this._config = config
	}
	getConfig () {
		return this._config
	}
	_request (authToken, url, data, cb) {
		data = JSON.stringify(data)

		var codeResponses = {
			401: 'Invalid token.',
			503: 'Context Broker unavailable.',
		}

		request.post(this.getConfig().url + '/' + url, {
			timeout: this.getConfig().timeout || 3000,
			headers: {
				'X-Auth-Token': authToken,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: data,
		}, function (err, httpResponse, data) {
			if (err) return cb(err)

			var code = httpResponse.statusCode
			if (codeResponses[code]) {
				err = new Error(codeResponses[code])
				err.statusCode = code
				return cb(err)
			}

			data = JSON.parse(data)

			if (data.errorCode) {
				err = data.errorCode
				return cb(err.reasonPhrase + ' (' + err.code + '): ' + err.details)
			}

			cb(null, data)
		})
	}
	getSensorMetadata (authToken, id, cb) {
		id = '' + id

		// Check cache
		var cached = this._cache[id]
		if (cached) {
			// Default: 15 minutes. Use -1 to disable caching.
			var expireTime = (this.getConfig().cacheExpireTime || 15 * 60 * 1000)
			if (cached.timestamp > Date.now() - expireTime) {
				return cb(null, cached.metadata)
			} else {
				delete this._cache[id]
			}
		}

		// Request from Context Broker
		this._request(authToken, 'queryContext', {
			entities: [
				{
					type: 'SensorMetadata',
					isPattern: 'false',
					id: id,
				},
			],
		}, (err, data) => {
			if (err) return cb(err)

			try {
				var attributes = data.contextResponses[0].contextElement.attributes

				// Since the Context Broker doesn't keep the order of metadatas, sort them by 'index' attribute
				attributes.forEach(function (attr) {
					var index = 0

					attr.properties = []

					if (attr.metadatas) {
						attr.metadatas.forEach(function (prop) {
							if (prop.name === 'index') {
								index = parseInt(prop.value)
							} else {
								attr.properties.push(prop)
							}
						})
					}

					attr.index = index
					delete attr.metadatas
				})

				attributes.sort(function (a, b) { return a.index - b.index })

				// Parse calibrate functions
				attributes.forEach(function (attr) {
					if ( ! attr.properties) return
					attr.properties.forEach(function (prop) {
						if (prop.name !== 'calibrate') return
						prop.value = decodeURI(prop.value)
					})
				})

				// Create metadata
				var metadata = new SensorMetadata(attributes)

				// Cache result
				this._cache[id] = {metadata, timestamp: Date.now()}

				cb(null, metadata)
			} catch (err) {
				cb(err)
			}
		})
	}
	insertSensorData (authToken, data, fallbackDate, cb) {
		if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

		var values = data.getData()
		var attributes = []

		// Determine timestamp
		var timestamp = values.timestamp
		if ( ! timestamp) timestamp = fallbackDate
		timestamp = (new Date(timestamp).getTime() || Date.now())

		// Format attributes
		for (var name in values) {
			attributes.push({
				name: name,
				value: values[name],
			})
		}

		// Append timestamp as attribute
		attributes.push({ name: 'timestamp', value: '' + timestamp })

		// Insert sensor data
		this._request(authToken, 'updateContext', {
			contextElements: [
				{
					type: 'SensorData',
					id: data.getDeviceId() + '-' + timestamp,
					attributes: attributes,
				},
			],
			updateAction: 'APPEND_STRICT',
		}, function (err, data) {
			if (err) return cb(err)
			cb(null, data.contextResponses[0].contextElement.id)
		})
	}
}
