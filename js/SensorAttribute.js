var objectAssign = require('object-assign')

function SensorAttribute (data) {
	this.setData(data || {})
}

objectAssign(SensorAttribute.prototype, {
	setData: function (data) {
		this._data = data
	},
	getData: function () {
		return this._data
	},
	getName: function () {
		return this.getData().name
	},
	getType: function () {
		return this.getData().type
	},
	getValue: function () {
		return this.getData().value
	},
	getProperties: function () {
		return this.getData().properties || []
	},
})

module.exports = SensorAttribute
