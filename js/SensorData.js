import SensorMetadata from './SensorMetadata'

export default class SensorData {
	constructor (buffer) {
		if (buffer) this.setBuffer(buffer)
		this.setData({})
	}
	setBuffer (buffer) {
		if ( ! Buffer.isBuffer(buffer)) throw new Error('Invalid Buffer given.')
		if (buffer.length < 8) throw new Error('Buffer contains less than 8 bytes.')
		this._buffer = buffer
	}
	getBuffer () {
		return this._buffer
	}
	getDeviceId () {
		var buffer = this.getBuffer()
		if ( ! buffer) return
		return buffer.toString('hex', 0, 8).toLowerCase()
	}
	setData (data) {
		this._data = data
	}
	getData () {
		return this._data
	}
	setValue (name, val) {
		var data = this.getData()
		data[name] = val
	}
	getValue (name) {
		return this.getData()[name]
	}
	setMetadata (metadata) {
		if ( ! (metadata instanceof SensorMetadata)) throw new Error('Invalid SensorMetadata given.')
		this._metadata = metadata
	}
	getMetadata () {
		return this._metadata
	}
}
