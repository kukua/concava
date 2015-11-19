export default class SensorAttribute {
	constructor (name) {
		this.setName(name)
		this.setConverters([])
		this.setCalibrators([])
		this.setValidators([])
	}
	setName (name) {
		this._name = name
	}
	getName () {
		return this._name
	}
	setConverters (converters) {
		this._converters = converters
	}
	getConverters () {
		return this._converters
	}
	setCalibrators (calibrators) {
		this._calibrators = calibrators
	}
	getCalibrators () {
		return this._calibrators
	}
	setValidators (validators) {
		this._validators = validators
	}
	getValidators () {
		return this._validators
	}
	addConverter (type, value) {
		this._converters.push({ type, value })
	}
	addCalibrator (fn) {
		this._calibrators.push(fn)
	}
	addValidator (type, value) {
		this._validators.push({ type, value })
	}
}
