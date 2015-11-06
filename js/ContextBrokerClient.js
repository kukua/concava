import request from 'request'
import SensorData from './SensorData'
import SensorMetadata from './SensorMetadata'

export default class ContextBrokerClient {
	constructor (config) {
		this.setConfig(config || {})
	}
	setConfig (config) {
		this._config = config
	}
	getConfig () {
		return this._config
	}
	setAuthToken (token) {
		this.getConfig().authToken = token
	}
	getAuthToken () {
		return this.getConfig().authToken
	}
	_request (url, data, cb) {
		data = JSON.stringify(data)

		var codeResponses = {
			401: 'Invalid token.',
			503: 'Context Broker unavailable.',
		}

		request.post(this.getConfig().url + '/' + url, {
			timeout: this.getConfig().timeout || 3000,
			headers: {
				'X-Auth-Token': this.getAuthToken(),
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
	getSensorMetadata (id, cb) {
		this._request('queryContext', {
			entities: [
				{
					type: 'SensorMetadata',
					isPattern: 'false',
					id: '' + id,
				},
			],
		}, function (err, data) {
			if (err) return cb(err)

			try {
				var attributes = data.contextResponses[0].contextElement.attributes

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

				cb(null, new SensorMetadata(attributes))
			} catch (err) {
				cb(err)
			}
		})
	}
	insertSensorData (data, fallbackDate, cb) {
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
		this._request('updateContext', {
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
