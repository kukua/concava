import Calibrator from '../src/Calibrator'
import SensorData from '../src/SensorData'
import SensorAttribute from '../src/SensorAttribute'

describe('Calibrator', () => {
	var instance

	beforeEach(() => {
		instance = new Calibrator
	})

	it('should be a class', () => {
		expect(instance).toEqual(jasmine.any(Calibrator))
	})

	// Calibrate method
	function createData () {
		var data = new SensorData
		var attr = new SensorAttribute('val')
		data.setAttributes([attr])
		data.setValue('val', 100)
		return [data, attr]
	}

	it('should return new value', () => {
		var [data, attr] = createData()
		attr.addCalibrator((val) => val * 2)
		instance.calibrate(data)
		expect(data.getValue('val')).toBe(200)
	})
	it('should parse function strings', () => {
		var [data, attr] = createData()
		attr.addCalibrator('function () { return val + 9000 }')
		instance.calibrate(data)
		expect(data.getValue('val')).toBe(9100) // This should be over 9000
	})
	it('should process multiple calibrators (sequentially)', () => {
		var [data, attr] = createData()
		attr.addCalibrator((val) => val * 2)
		attr.addCalibrator((val) => val + 100)
		instance.calibrate(data)
		expect(data.getValue('val')).toBe(300)
	})
	it('should disallow access to global scope', () => {
		var [data, attr] = createData()
		attr.addCalibrator((val) => global)
		instance.calibrate(data)
		var vars = data.getValue('val')
		expect(vars.root).toBe(vars)
		expect(vars.GLOBAL).toBe(vars)
		expect(vars.global).toBe(vars)
		expect(vars.SANDBOX).toBe(true)
		expect(typeof vars.Math.min).toBe('function')
		expect(typeof vars.Math.max).toBe('function')
		expect(typeof vars.Math.random).toBe('function')
		expect(typeof vars.Math.pow).toBe('function')
		expect(vars.val).toBe(100)
		expect(vars.info).toEqual({})
		expect(Object.keys(vars).length).toBe(7)
	})
	it('should allow use of Math library', () => {
		var [data, attr] = createData()
		attr.addCalibrator((val) => Math.pow(val, 3))
		instance.calibrate(data)
		expect(data.getValue('val')).toBe(1000000)
	})
})
