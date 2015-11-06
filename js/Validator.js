import SensorData from './SensorData'

export default class Validator {
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
	validate (data, cb) {
		if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

		data.getMetadata().getAttributes().forEach((attr) => {
			var value = data.getValue(attr.getName())
			var dirty = false

			attr.getProperties().forEach((prop) => {
				if (prop.name === 'calibrate') return

				var fn = this.getType(prop.name)

				if (typeof fn !== 'function') {
					console.error('No validator for property', prop)
					return
				}

				value = fn(value, prop.value)
				dirty = true
			})

			if (dirty) {
				data.setValue(attr.getName(), value)
			}
		})

		cb()
	}
}
