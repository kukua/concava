import {VM} from 'vm2'
import SensorData from './SensorData'

export default class Calibrator {
	calibrate (data, cb) {
		if ( ! (data instanceof SensorData)) return cb('Invalid SensorData given.')

		var meta = data.getMetadata()

		meta.getAttributes().forEach(function (attr) {
			attr.getProperties().forEach(function (prop) {
				if (prop.name !== 'calibrate') return

				var vm = new VM({
					timeout: 1000,
					sandbox: {
						Math: Math,
						val: data.getValue(attr.getName())
					},
				})
				var value = vm.run('(' + decodeURI(prop.value.toString()) + ')(val)')
				data.setValue(attr.getName(), value)
			})
		})

		cb()
	}
}
