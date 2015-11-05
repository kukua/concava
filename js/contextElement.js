var objectAssign = require('object-assign')

function ContextElement (buffer) {
	if (buffer) this.setBuffer(buffer)
	this.setData({})
}

objectAssign(ContextElement.prototype, {
	setBuffer: function (buffer) {
		if ( ! Buffer.isBuffer(buffer)) throw new Error('Given buffer is not a Buffer instance.')
		this._buffer = buffer
	},
	getBuffer: function () {
		return this._buffer
	},
	setData: function (data) {
		this._data = data
	},
	getData: function () {
		return this._data
	},
	setAttributeValue: function (name, val) {
		var data = this.getData()
		data[name] = val
	},
	getAttributeValue: function (name) {
		return this.getData()[name]
	},
	getDeviceId: function () {
		return this.getBuffer().toString('hex', 0, 8)
	},
	setMapping: function (mapping) {
		this._mapping = mapping
	},
	getMapping: function () {
		return this._mapping
	},
	getAttributeType: function (name) {
		var attr = this.getMapping().attributes.filter(function (attr) { return attr.name === name })[0]
		return attr ? attr.type : null
	},
})

module.exports = ContextElement
