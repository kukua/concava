import SensorData from './SensorData'

export default class Converter {
	constructor (types) {
		this.setTypes(types || {})
	}
	setTypes (types) {
		this._types = types
	}
	getTypes () {
		return this._types
	}
	setType (name, type) {
		this._types[name] = type
	}
	getType (name) {
		return this._types[name]
	}
	convert (data) {
		if ( ! (data instanceof SensorData)) throw new Error('Invalid SensorData given.')

		var types = this.getTypes()
		var attributes = data.getMetadata().getAttributes()
		var context = {
			data: data,
			buffer: data.getBuffer(),
			pointer: 8,
			getType: this.getType.bind(this),
		}

		for (var i = 0; i < attributes.length; i += 1) {
			var attr = attributes[i]
			var fn = this.getType(attr.getType())

			if (typeof fn !== 'function') {
				throw new Error('Unsuported converter type: ' + attr.getType())
			}

			var err = fn.call(context, attr.getName(), attr.getValue())

			if (err) {
				throw new Error(err)
			}
		}
	}
}
