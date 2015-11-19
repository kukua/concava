import SensorAttribute from '../src/SensorAttribute'

describe('SensorAttribute', () => {
	var attr

	beforeEach((done) => {
		attr = new SensorAttribute
		done()
	})

	it('should be a class', () => {
		expect(attr).toEqual(jasmine.any(SensorAttribute))
	})

	// Setters/getters
	it('can set/get the name', () => {
		expect(typeof attr.setName).toBe('function')
		expect(typeof attr.getName).toBe('function')
		expect(attr.getName()).toBe(undefined)
		var name = 'test'
		attr.setName(name)
		expect(attr.getName()).toBe(name)
	})
	it('can set/get a converters array', () => {
		expect(typeof attr.setConverters).toBe('function')
		expect(typeof attr.getConverters).toBe('function')
		expect(attr.getConverters()).toEqual([])
		var converters = [{type: 'a', value: 1}]
		attr.setConverters(converters)
		expect(attr.getConverters()).toBe(converters)
	})
	it('can set/get a calibrators array', () => {
		expect(typeof attr.setCalibrators).toBe('function')
		expect(typeof attr.getCalibrators).toBe('function')
		expect(attr.getCalibrators()).toEqual([])
		var calibrators = [(val) => val * 2]
		attr.setCalibrators(calibrators)
		expect(attr.getCalibrators()).toBe(calibrators)
	})
	it('can set/get a validators array', () => {
		expect(typeof attr.setValidators).toBe('function')
		expect(typeof attr.getValidators).toBe('function')
		expect(attr.getValidators()).toEqual([])
		var validators = [{type: 'b', value: 2}]
		attr.setValidators(validators)
		expect(attr.getValidators()).toBe(validators)
	})
	it('can add a single converter', () => {
		expect(typeof attr.addConverter).toBe('function')
		expect(attr.getConverters()).toEqual([])
		var type, value, list

		type = 'a'
		value = 1
		attr.addConverter(type, value)
		list = attr.getConverters()
		expect(list.length).toBe(1)
		expect(list[0].type).toBe(type)
		expect(list[0].value).toBe(value)

		type = 'b'
		value = 2
		attr.addConverter(type, value)
		list = attr.getConverters()
		expect(list.length).toBe(2)
		expect(list[1].type).toBe(type)
		expect(list[1].value).toBe(value)
	})
	it('can add a single calibrator', () => {
		expect(typeof attr.addCalibrator).toBe('function')
		expect(attr.getCalibrators()).toEqual([])
		var fn, list

		fn = (val) => val * 2
		attr.addCalibrator(fn)
		list = attr.getCalibrators()
		expect(list.length).toBe(1)
		expect(list[0]).toBe(fn)

		fn = (val) => val * 3
		attr.addCalibrator(fn)
		list = attr.getCalibrators()
		expect(list.length).toBe(2)
		expect(list[1]).toBe(fn)
	})

	// Constructors
	it('should use first constructor param as name', () => {
		expect(attr.getName()).toBe(undefined)
		attr = new SensorAttribute('test')
		expect(attr.getName()).toBe('test')
	})
})
