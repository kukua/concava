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
	validate (data) {
		if ( ! (data instanceof SensorData)) throw new Error('Invalid SensorData given.')

		data.getAttributes().forEach((attr) => {
			var value = data.getValue(attr.getName())
			var dirty = false

			attr.getValidators().forEach((validator) => {
				var fn = this.getType(validator.type)

				if (typeof fn !== 'function') return

				value = fn(value, validator.value)
				dirty = true
			})

			if (dirty) {
				data.setValue(attr.getName(), value)
			}
		})
	}
}
