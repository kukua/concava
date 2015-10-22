var Orion = require('fiware-orion-client')
var NgsiHelper = require('fiware-orion-client/ngsi-helper').NgsiHelper
var objectAssign = require('object-assign')
var ContextElement = require('./contextElement')

function sanitize (data) {
	data = NgsiHelper.toNgsiObject(data)
	delete data.toXMLTree
	delete data.toXML
	return data
}

function ContextBrokerClient (config) {
	this._client = new Orion.Client(config)
}

objectAssign(ContextBrokerClient.prototype, {
	getClient: function () {
		return this._client
	},
	getPayloadMappingById: function (id, cb) {
		this.getClient().queryContext({ type: 'PayloadMapping', id: '' + id }).then(function (data) {
			cb(null, sanitize(data))
		}, cb)
	},
	insertContextElement: function (el, cb) {
		if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

		var data = el.getData()
		var attributes = []

		for (var name in data) {
			if (name === 'id') continue
			attributes.push({
				name: name,
				type: el.getAttributeType(name),
				value: data[name],
			})
		}

		var context = {
			id: el.getPayloadId() + '-' + new Date().getTime(),
			type: 'SensorData',
			attributes: attributes,
		}

		this.getClient().updateContext(context).then(function () {
			cb()
		}, cb)
	},
})

module.exports = ContextBrokerClient
