import request from 'request'
import Adapter from './Adapter'
import SensorData from '../SensorData'
import SensorAttribute from '../SensorAttribute'

export default class ContextBroker extends Adapter {
	constructor (config) {
		super(config)
		this._cache = {}
	}
	setSensorMetadata (authToken, data, cb) {
		if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

		var id = data.getDeviceId()

		// Check cache
		var cached = this._cache[id]

		if (cached && cached.timestamp > Date.now() - this.getConfig().cacheExpireTime) {
			data.setAttributes(cached.attributes)
			return cb()
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
		}, (err, result) => {
			if (err) return cb(err)

			var attributes = []

			try {
				result = result.contextResponses[0].contextElement.attributes

				// Since the Context Broker doesn't keep the order of attributes, sort them by 'index' attribute
				result.forEach(function (item) {
					var index = 0

					if (item.metadatas) {
						item.metadatas.forEach(function (meta) {
							if (meta.name === 'index') {
								index = parseInt(meta.value)
							}
						})
					}

					item.index = index
				})

				result.sort(function (a, b) { return a.index - b.index })

				// Parse into sensor attributes
				result.forEach(function (item) {
					var attr = new SensorAttribute

					attr.setName(item.name)
					attr.addConverter(item.type, item.value)

					if (item.metadatas) {
						item.metadatas.forEach(function (meta) {
							if (meta.name === 'index') return
							if (meta.name === 'calibrate') {
								attr.addCalibrator(new Function('value', decodeURI(meta.value)))
							} else {
								attr.addValidator(meta.name, meta.value)
							}
						})
					}

					attributes.push(attr)
				})

				// Cache result
				this._cache[id] = {attributes, timestamp: Date.now()}

				// Callback
				data.setAttributes(attributes)
				cb()
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
}
