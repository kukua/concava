export default class SensorAttribute {
	constructor (data) {
		this.setData(data || {})
	}
	setData (data) {
		this._data = data
	}
	getData () {
		return this._data
	}
	getName () {
		return this.getData().name
	}
	getType () {
		return this.getData().type
	}
	getValue () {
		return this.getData().value
	}
	getProperties () {
		return this.getData().properties || []
	}
}
