import SensorAttribute from './SensorAttribute'

export default class SensorMetadata {
	constructor (attributes) {
		this.setAttributes(Array.isArray(attributes) ? attributes : [])
	}
	setAttributes (attributes) {
		this._attributes = attributes.map(function (attr) {
			if (attr instanceof SensorAttribute) return attr

			return new SensorAttribute(attr)
		})
	}
	getAttributes () {
		return this._attributes
	}
	getAttribute (name) {
		return this.getAttributes().filter(function (attr) {
			return attr.getName() === name
		})[0]
	}
	getAttributeType (name) {
		var attr = this.getAttribute(name)
		return attr ? attr.getType() : undefined
	}
}
