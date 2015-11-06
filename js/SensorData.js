var objectAssign = require('object-assign')
var SensorMetadata = require('./SensorMetadata')

function SensorData (buffer) {
	if (buffer) this.setBuffer(buffer)
	this.setData({})
}

objectAssign(SensorData.prototype, {
	setBuffer: function (buffer) {
		if ( ! Buffer.isBuffer(buffer)) throw new Error('Invalid Buffer given.')
		if (buffer.length < 8) throw new Error('Buffer contains less than 8 bytes.')
		this._buffer = buffer
	},
	getBuffer: function () {
		return this._buffer
	},
	getDeviceId: function () {
		var buffer = this.getBuffer()
		if ( ! buffer) return
		return buffer.toString('hex', 0, 8).toLowerCase()
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
		if ( ! (metadata instanceof SensorMetadata)) throw new Error('Invalid SensorMetadata given.')
		this._metadata = metadata
	},
	getMetadata: function () {
		return this._metadata
	},
})

module.exports = SensorData
