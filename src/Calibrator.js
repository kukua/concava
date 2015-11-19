import {VM} from 'vm2'
import SensorData from './SensorData'

export default class Calibrator {
	calibrate (data) {
		if ( ! (data instanceof SensorData)) throw new Error('Invalid SensorData given.')

		data.getAttributes().forEach(function (attr) {
			attr.getCalibrators().forEach(function (calibrator) {
				var vm = new VM({
					timeout: 1000,
					sandbox: {
						Math: Math,
						val: data.getValue(attr.getName())
					},
				})

				var value = vm.run('(' + calibrator.toString() + ')(val)')

				data.setValue(attr.getName(), value)
			})
		})
	}
}
