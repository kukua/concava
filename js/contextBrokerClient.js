var Orion = require('fiware-orion-client')
var objectAssign = require('object-assign')
var ContextElement = require('./contextElement')

function ContextBrokerClient (config) {
	this._client = new Orion.Client(config)
}

objectAssign(ContextBrokerClient.prototype, {
	getClient: function () {
		return this._client
	},
	insertContextElement: function (el) {
		//if ( ! (el instanceof ContextElement)) return cb('Given element is not a ContextElement.')

		this.getClient().queryContext({ type: 'Car', id: 'Car1' }).then(function (data) {
			console.log(data)
		}, function (err) {
			console.error(err)
		})
	},
})

module.exports = ContextBrokerClient
