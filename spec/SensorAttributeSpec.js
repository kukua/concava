import SensorAttribute from '../js/SensorAttribute'

describe('SensorAttribute', () => {
	var data = {
		name: 'a',
		type: 'string',
		value: 'hello',
		properties: [
			{ type: 'min' },
			{ type: 'max' },
			{ type: 'calibrate' },
		],
	}
	var attr

	beforeEach((done) => {
		attr = new SensorAttribute
		done()
	})

	it('should be a class', () => {
		expect(attr).toEqual(jasmine.any(SensorAttribute))
	})

	// Setters/getters
	it('can set/get a data object', () => {
		expect(typeof attr.setData).toBe('function')
		expect(typeof attr.getData).toBe('function')
		attr.setData(data)
		expect(attr.getData()).toBe(data)
	})
	it('can get the name', () => {
		expect(typeof attr.getName).toBe('function')
		expect(attr.getName()).toBe(undefined)
		attr.setData(data)
		expect(attr.getName()).toBe(data.name)
	})
	it('can get the type', () => {
		expect(typeof attr.getType).toBe('function')
		expect(attr.getType()).toBe(undefined)
		attr.setData(data)
		expect(attr.getType()).toBe(data.type)
	})
	it('can get the value', () => {
		expect(typeof attr.getValue).toBe('function')
		expect(attr.getValue()).toBe(undefined)
		attr.setData(data)
		expect(attr.getValue()).toBe(data.value)
	})
	it('can get the properties', () => {
		expect(typeof attr.getProperties).toBe('function')
		expect(attr.getProperties()).toEqual([])
		attr.setData(data)
		expect(attr.getProperties()).toBe(data.properties)
	})

	// Constructors
	it('should use first constructor param as data', () => {
		var attr = new SensorAttribute(data)
		expect(attr.getData()).toBe(data)
	})
	it('should use empty object as data when no arguments are given', () => {
		var attr = new SensorAttribute()
		expect(attr.getData()).toEqual({})
	})
})
