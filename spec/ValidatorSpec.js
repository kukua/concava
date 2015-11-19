import Validator from '../src/Validator'
import SensorData from '../src/SensorData'
import SensorAttribute from '../src/SensorAttribute'

describe('Validator', () => {
	var instance

	var types = {
		min: (current, valid) => Math.max(current, valid),
		max: (current, valid) => Math.min(current, valid),
		plus: (current, value) => current + value,
		times: (current, value) => current * value,
	}

	beforeEach(() => {
		instance = new Validator
	})

	it('should be a class', () => {
		expect(instance).toEqual(jasmine.any(Validator))
	})

	// Setters/getters
	it('can set/get types', () => {
		expect(typeof instance.setTypes).toBe('function')
		expect(typeof instance.getTypes).toBe('function')
		expect(instance.getTypes()).toEqual({})
		instance.setTypes(types)
		expect(instance.getTypes()).toBe(types)
	})
	it('can set/get type', () => {
		expect(typeof instance.setType).toBe('function')
		expect(typeof instance.getType).toBe('function')
		expect(instance.getType('min')).toBe(undefined)
		instance.setTypes(types)
		expect(instance.getType('min')).toBe(types.min)
		instance.setTypes({})
		expect(instance.getType('max')).toBe(undefined)
		instance.setType('max', types.max)
		expect(instance.getType('max')).toBe(types.max)
	})

	// Validate method
	function createData () {
		var data = new SensorData
		var attr = new SensorAttribute('val')
		data.setAttributes([attr])
		data.setValue('val', 100)
		return [data, attr]
	}

	it('should not set values for non-attributes', () => {
		var [data] = createData()
		var attr = new SensorAttribute('skip1')
		attr.addConverter('skip', 2)
		data.setAttributes([attr])
		instance.validate(data)
		expect(data.getValue('val')).toBe(100)
		expect(data.getValue('skip1')).toBe(undefined)
	})
	it('should only change value if changes are made (dirty check)', () => {
		var [data, attr] = createData()
		// No validators are added
		var obj = {}
		data.setValue('val', obj)
		instance.validate(data)
		expect(data.getValue('val')).toBe(obj)
	})
	it('should process min validator', () => {
		var [data, attr] = createData()
		attr.addValidator('min', 110)
		instance.setTypes(types)
		instance.validate(data)
		expect(data.getValue('val')).toBe(110)
	})
	it('should process max validator', () => {
		var [data, attr] = createData()
		attr.addValidator('max', 90)
		instance.setTypes(types)
		instance.validate(data)
		expect(data.getValue('val')).toBe(90)
	})
	it('should process multiple validators (sequentially)', () => {
		var [data, attr] = createData()
		attr.addValidator('plus', 10)
		attr.addValidator('times', 3)
		instance.setTypes(types)
		instance.validate(data)
		expect(data.getValue('val')).toBe(330)
	})

	// Constructors
	it('should use first constructor param as types', () => {
		var instance = new Validator(types)
		expect(instance.getTypes()).toBe(types)
	})
	it('should use empty object as types when no arguments are given', () => {
		var instance = new Validator()
		expect(instance.getTypes()).toEqual({})
	})
})
