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
		var attributes = data.getAttributes()
		var context = {
			data: data,
			buffer: data.getBuffer(),
			pointer: 0,
			getType: this.getType.bind(this),
		}

		attributes.forEach((attr) => {
			attr.getConverters().forEach((converter) => {
				var fn = this.getType(converter.type)

				if (typeof fn !== 'function') throw new Error('Unsuported converter type: ' + converter.type)

				var err = fn.call(context, attr.getName(), converter.value)

				if (err) throw new Error(err)
			})
		})
	}
}
