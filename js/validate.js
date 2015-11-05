var SensorData = require('./SensorData')

var ignores = ['index', 'calibrate']
var validators = {
	min: function (current, valid) { return Math.max(current, valid) },
	max: function (current, valid) { return Math.min(current, valid) },
}

module.exports = function (el, cb) {
	if ( ! (el instanceof SensorData)) return cb('Invalid SensorData given.')

	var attributes = el.getMapping().attributes

	for (var i in attributes) {
		var attr = attributes[i]

		if ( ! Array.isArray(attr.metadatas)) continue

		var value = el.getAttributeValue(attr.name)
		var dirty = false

		attr.metadatas.forEach(function (meta) {
			if (ignores.indexOf(meta.name) !== -1) return
			var fn = validators[meta.name]
			if (typeof fn !== 'function') {
				console.error('No validator for meta', meta)
				return
			}
			value = fn(value, meta.value)
			dirty = true
		})

		if (dirty) {
			el.setAttributeValue(attr.name, value)
		}
	}

	cb()
}
