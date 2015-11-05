var objectAssign = require('object-assign')
var SensorData = require('./SensorData')

function Converter (types) {
	this.setTypes(types || {})
}

objectAssign(Converter.prototype, {
	setTypes: function (types) {
		this._types = types
	},
	getTypes: function () {
		return this._types
	},
	setType: function (name, type) {
		this._types[name] = type
	},
	getType: function (name) {
		return this._types[name]
	},
	convert: function (data, cb) {
		if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

		var types = this.getTypes()
		var attributes = data.getMetadata().getAttributes()
		var context = {
			data: data,
			buffer: data.getBuffer(),
			pointer: 8,
			getType: this.getType.bind(this),
		}

		for (var i = 0; i < attributes.length; i += 1) {
			var attr = attributes[i]
			var fn = this.getType(attr.getType())

			if (typeof fn !== 'function') {
				return cb('Unsuported converter type: ' + attr.getType())
			}

			var err = fn.call(context, attr.getName(), attr.getValue())

			if (err) {
				return cb(err)
			}
		}

		cb()
	},
})

module.exports = Converter
