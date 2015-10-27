var objectAssign = require('object-assign')
var ContextElement = require('./contextElement')
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
				return cb('[ContextBroker] ' + err.reasonPhrase + ' (' + err.code + '): ' + err.details)
			}

			cb(null, data)
		})
	},
	getPayloadMappingById: function (id, cb) {
		this._request('queryContext', {
			entities: [
				{
					type: 'PayloadMapping',
					isPattern: 'false',
					id: '' + id,
				},
			],
		}, function (err, data) {
			if (err) return cb(err)

			var mapping = data.contextResponses[0].contextElement
			var findIndex = function (a) { return a.name === 'index' }

			mapping.attributes.sort(function (a, b) {
				return parseInt(a.metadatas.find(findIndex).value) -
					parseInt(b.metadatas.find(findIndex).value)
			})

			cb(null, mapping)
		})
	},
	insertContextElement: function (el, cb) {
		if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

		var data = el.getData()
		var attributes = []
		var timestamp = new Date().getTime()

		for (var name in data) {
			attributes.push({
				name: name,
				value: data[name],
			})
		}

		attributes.push({ name: 'timestamp', value: '' + timestamp })

		this._request('updateContext', {
			contextElements: [
				{
					type: 'SensorData',
					id: el.getPayloadId() + '-' + timestamp,
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
