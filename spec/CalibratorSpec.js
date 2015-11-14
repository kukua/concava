import Calibrator from '../src/Calibrator'
import SensorMetadata from '../src/SensorMetadata'
import SensorData from '../src/SensorData'

describe('Calibrator', () => {
	var cal, calibrate

	beforeEach(() => {
		cal = new Calibrator
		calibrate = cal.calibrate.bind(cal)
	})

	it('should be a class', () => {
		expect(cal).toEqual(jasmine.any(Calibrator))
	})

	// Calibrate method
	function createData (config = {}) {
		var meta = new SensorMetadata([
			{
				name: 'val',
				type: '',
				value: null,
				properties: [
					{
						name: 'calibrate',
						type: 'function',
						value: config.fn,
					},
					...(config.properties || []),
				]
			},
		])
		var data = new SensorData
		data.setMetadata(meta)
		data.setValue('val', (config.value !== undefined ? config.value : 100))
		return data
	}

	it('should return new value', () => {
		var data = createData({ fn: (val) => val * 2 })
		calibrate(data)
		expect(data.getValue('val')).toBe(200)
	})
	it('should parse function strings', () => {
		var data = createData({ fn: 'function (val) { return val * 2 }' })
		calibrate(data)
		expect(data.getValue('val')).toBe(200)
	})
	it('should parse url encoded function strings', () => {
		var data = createData({ fn: escape('function (val) { return val * 2 }') })
		calibrate(data)
		expect(data.getValue('val')).toBe(200)
	})
	it('should sequentially process multiple calibrate attributes', () => {
		var data = createData({
			fn: (val) => val * 2,
			properties: [
				{
					name: 'calibrate',
					type: 'function',
					value: (val) => val + 100,
				},
			],
		})
		calibrate(data)
		expect(data.getValue('val')).toBe(300)
	})
	it('should ignore non-calibrate attributes', () => {
		var data = createData({
			fn: (val) => val * 2,
			properties: [
				{
					name: 'min',
					type: 'integer',
					value: 100,
				},
				{
					name: 'index',
					type: 'integer',
					value: 3,
				},
			],
		})
		calibrate(data)
		expect(data.getValue('val')).toBe(200)
	})
	it('should disallow access to global scope', () => {
		var data = createData({ fn: (val) => global })
		calibrate(data)
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
		expect(Object.keys(vars).length).toBe(6)
	})
	it('should allow use of Math library', () => {
		var data = createData({ fn: (val) => Math.pow(val, 3) })
		calibrate(data)
		expect(data.getValue('val')).toBe(1000000)
	})
})
