var objectAssign = require('object-assign')
var ContextElement = require('./contextElement')
var request = require('request')

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
				return cb(err.reasonPhrase + ' (' + err.code + '): ' + err.details)
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
			cb(null, data.contextResponses[0].contextElement)
		})
	},
	insertContextElement: function (el, cb) {
		if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

		var data = el.getData()
		var attributes = []

		for (var name in data) {
			attributes.push({
				name: name,
				value: data[name],
			})
		}

		this._request('updateContext', {
			contextElements: [
				{
					type: 'SensorData',
					id: el.getPayloadId() + '-' + new Date().getTime(),
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
