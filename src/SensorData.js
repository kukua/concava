import {inspect} from 'util'

var validDeviceId = /^[a-f0-9]{16}$/

export default class SensorData {
	constructor (id, buffer) {
		this.setData(this.getDefaultData())
		if (id) this.setDeviceId(id)
		if (buffer) this.setBuffer(buffer)
		this.setAttributes([])
	}
	setDeviceId (id) {
		id = id.toLowerCase()
		if ( ! id.match(validDeviceId)) return false
		this._id = id.toLowerCase()
		return true
	}
	getDeviceId () {
		return this._id
	}
	setBuffer (buffer) {
		if ( ! Buffer.isBuffer(buffer)) throw new Error('Invalid Buffer given.')
		if ( ! buffer.length) throw new Error('Empty Buffer given.')
		this._buffer = buffer
		this.setValue('_raw', buffer.toString('hex'))
	}
	getBuffer () {
		return this._buffer
	}
	setData (data) {
		this._data = data
	}
	getDefaultData () {
		return {
			timestamp: Math.floor(Date.now() / 1000)
		}
	}
	getData () {
		return this._data
	}
	setAttributes (attributes) {
		this._attributes = attributes
	}
	getAttributes () {
		return this._attributes
	}
	setValue (name, val) {
		var data = this.getData()
		data[name] = val
	}
	getValue (name) {
		return this.getData()[name]
	}
	toString () {
		return this.getDeviceId() + ' ' + inspect(this.getData())
	}
}
