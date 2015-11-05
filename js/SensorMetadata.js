var objectAssign = require('object-assign')
var SensorAttribute = require('./SensorAttribute')

function SensorMetadata (attributes) {
	this.setAttributes(Array.isArray(attributes) ? attributes : [])
}

objectAssign(SensorMetadata.prototype, {
	setAttributes: function (attributes) {
		this._attributes = attributes.map(function (attr) {
			if (attr instanceof SensorAttribute) return attr

			return new SensorAttribute(attr)
		})
	},
	getAttributes: function () {
		return this._attributes
	},
	getAttribute: function (name) {
		return this.getAttributes().filter(function (attr) {
			return attr.getName() === name
		})[0]
	},
	getAttributeType: function (name) {
		var attr = this.getAttribute(name)
		return attr ? attr.getType() : undefined
	},
})

module.exports = SensorMetadata
