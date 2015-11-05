var SensorData = require('./SensorData')
var VM = require('vm2').VM

module.exports = function (data, cb) {
	if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

	var meta = data.getMetadata()

	meta.getAttributes().forEach(function (attr) {
		attr.getProperties().forEach(function (prop) {
			if (prop.name !== 'calibrate') return

			var vm = new VM({
				timeout: 1000,
				sandbox: {
					val: data.getValue(attr.getName())
				},
			})
			var value = vm.run('(' + decodeURI(prop.value) + ')(val)')
			data.setValue(attr.getName(), value)
		})
	})

	cb()
}
