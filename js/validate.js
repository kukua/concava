var SensorData = require('./SensorData')

var validators = {
	min: function (current, valid) { return Math.max(current, valid) },
	max: function (current, valid) { return Math.min(current, valid) },
}

module.exports = function (data, cb) {
	if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

	data.getMetadata().getAttributes().forEach(function (attr) {
		var value = data.getValue(attr.getName())
		var dirty = false

		attr.getProperties().forEach(function (prop) {
			if (prop.name === 'calibrate') return

			var fn = validators[prop.name]

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
