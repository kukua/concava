import SensorMetadata from './SensorMetadata'

export default class SensorData {
	constructor (id, buffer) {
		if (id) this.setDeviceId(id)
		if (buffer) this.setBuffer(buffer)
		this.setData({})
	}
	setDeviceId (id) {
		this._id = id.toLowerCase()
	}
	getDeviceId () {
		return this._id
	}
	setBuffer (buffer) {
		if ( ! Buffer.isBuffer(buffer)) throw new Error('Invalid Buffer given.')
		if ( ! buffer.length) throw new Error('Empty Buffer given.')
		this._buffer = buffer
	}
	getBuffer () {
		return this._buffer
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
