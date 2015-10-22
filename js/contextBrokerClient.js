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
	insertContextElement: function (el) {
		if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

		console.log('insertContextElement')
	},
})

module.exports = ContextBrokerClient
