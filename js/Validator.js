var objectAssign = require('object-assign')
var SensorData = require('./SensorData')

function Validator (types) {
	this.setTypes(types || {})
}

objectAssign(Validator.prototype, {
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
	validate: function (data, cb) {
		if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

		var self = this

		data.getMetadata().getAttributes().forEach(function (attr) {
			var value = data.getValue(attr.getName())
			var dirty = false

			attr.getProperties().forEach(function (prop) {
				if (prop.name === 'calibrate') return

				var fn = self.getType(prop.name)

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
	},
})

module.exports = Validator
