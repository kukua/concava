var objectAssign = require('object-assign')

function SensorData (buffer) {
	if (buffer) this.setBuffer(buffer)
	this.setData({})
}

objectAssign(SensorData.prototype, {
	setBuffer: function (buffer) {
		if ( ! Buffer.isBuffer(buffer)) throw new Error('Given buffer is not a Buffer instance.')
		this._buffer = buffer
	},
	getBuffer: function () {
		return this._buffer
	},
	getDeviceId: function () {
		return this.getBuffer().toString('hex', 0, 8).toUpperCase()
	},
	setData: function (data) {
		this._data = data
	},
	getData: function () {
		return this._data
	},
	setValue: function (name, val) {
		var data = this.getData()
		data[name] = val
	},
	getValue: function (name) {
		return this.getData()[name]
	},
	setMetadata: function (metadata) {
		this._metadata = metadata
	},
	getMetadata: function () {
		return this._metadata
	},
})

module.exports = SensorData
