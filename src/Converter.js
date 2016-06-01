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
				var err

				if (typeof fn !== 'function') throw new Error('Unsuported converter type: ' + converter.type)

				try {
					err = fn.call(context, attr.getName(), converter.value)

					if (err) throw new Error(err)
				} catch (e) {
					err = e
					if (err instanceof RangeError) {
						err = new Error(`Cannot convert '${attr.getName()}' (${converter.type}): ` +
							'Payload too small.')
						err.statusCode = 400
					}
					throw err
				}
			})
		})
	}
}
