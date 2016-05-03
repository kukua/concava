export default class SensorAttribute {
	constructor (name) {
		this.setName(name)
		this.setConverters([])
		this.setCalibrators([])
		this.setValidators([])
	}
	setName (name) {
		this._name = name
		return this
	}
	getName () {
		return this._name
	}
	setConverters (converters) {
		this._converters = converters
		return this
	}
	getConverters () {
		return this._converters
	}
	setCalibrators (calibrators) {
		this._calibrators = calibrators
		return this
	}
	getCalibrators () {
		return this._calibrators
	}
	setValidators (validators) {
		this._validators = validators
		return this
	}
	getValidators () {
		return this._validators
	}
	addConverter (type, value) {
		this._converters.push({ type, value })
		return this
	}
	addCalibrator (fn) {
		this._calibrators.push(fn)
		return this
	}
	addValidator (type, value) {
		this._validators.push({ type, value })
		return this
	}
}
