var objectAssign = require('object-assign')
var SensorData = require('./SensorData')
var SensorMetadata = require('./SensorMetadata')
var request = require('request')

require('array.prototype.find')

function ContextBrokerClient (config) {
	if (config) this.setConfig(config)
}

objectAssign(ContextBrokerClient.prototype, {
	setConfig: function (config) {
		this._config = config
	},
	getConfig: function () {
		return this._config
	},
	_request: function (url, data, cb) {
		data = JSON.stringify(data)
		request.post(this._config.url + '/' + url, {
			timeout: this._config.timeout || 3000,
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: data,
		}, function (err, httpResponse, data) {
			if (err) return cb(err)

			data = JSON.parse(data)

			if (data.errorCode) {
				err = data.errorCode
				return cb('[ContextBrokerClient] ' + err.reasonPhrase + ' (' + err.code + '): ' + err.details)
			}

			cb(null, data)
		})
	},
	getSensorMetadata: function (id, cb) {
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
	},
	insertSensorData: function (data, fallbackDate, cb) {
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
	},
})

module.exports = ContextBrokerClient
