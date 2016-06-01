import Converter from '../src/Converter'
import SensorData from '../src/SensorData'
import SensorAttribute from '../src/SensorAttribute'
import types from '../src/types/convert'

describe('Converter', () => {
	var instance

	beforeEach(() => {
		instance = new Converter
	})

	it('should be a class', () => {
		expect(instance).toEqual(jasmine.any(Converter))
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
		expect(instance.getType('integer')).toBe(undefined)
		instance.setTypes(types)
		expect(instance.getType('integer')).toBe(types.integer)
		instance.setTypes({})
		expect(instance.getType('ascii')).toBe(undefined)
		instance.setType('ascii', types.ascii)
		expect(instance.getType('ascii')).toBe(types.ascii)
	})

	// Convert method
	function createData () {
		var data = new SensorData
		var attr = new SensorAttribute('val')
		data.setAttributes([attr])
		data.setValue('val', 100)
		return [data, attr]
	}

	it('should apply converter', () => {
		var [data, attr] = createData()
		attr.addConverter('integer', 4)
		data.setBuffer(new Buffer('00000539', 'hex'))
		instance.setTypes(types)
		instance.convert(data)
		expect(data.getValue('val')).toBe(1337)
	})
	it('should have context variables', () => {
		var [data, attr] = createData()
		attr.addConverter('test', 0)
		data.setBuffer(new Buffer('00000539', 'hex'))
		instance.setType('test', function (name, value) {
			this.data.setValue(name, this)
		})
		instance.convert(data)
		var context = data.getValue('val')
		expect(typeof context).toBe('object')
		expect(Object.keys(context).length).toBe(4)
		expect(context.data).toEqual(jasmine.any(SensorData))
		expect(context.buffer).toEqual(jasmine.any(Buffer))
		expect(typeof context.pointer).toBe('number')
		expect(typeof context.getType).toBe('function')
	})
	it('should have pointer that starts at first byte', () => {
		var [data, attr] = createData()
		attr.addConverter('test', 0)
		data.setBuffer(new Buffer('00000539', 'hex'))
		instance.setType('test', function (name, value) {
			this.data.setValue(name, this.pointer)
		})
		instance.convert(data)
		expect(data.getValue('val')).toBe(0)
	})
	it('should pass name and value into converter function', () => {
		var [data, attr] = createData()
		attr.addConverter('test', 4)
		data.setBuffer(new Buffer('00000539', 'hex'))
		instance.setType('test', function (...args) {
			this.data.setValue(args[0], args)
		})
		instance.convert(data)
		var args = data.getValue('val')
		expect(Array.isArray(args)).toBe(true)
		expect(args.length).toBe(2)
		expect(args[0]).toBe('val')
		expect(args[1]).toBe(4)
	})
	it('should allow chaining converters', () => {
		var [data, attr] = createData()
		attr.addConverter('asciiFloat', 5)
		data.setBuffer(new Buffer('32332e3134', 'hex'))
		instance.setTypes(types)
		instance.convert(data)
		expect(data.getValue('val')).toBe(23.14)
	})
	it('should convert buffer into multiple values', () => {
		var data = new SensorData
		var attributes = []
		var attr

		attr = new SensorAttribute('temp1')
		attr.addConverter('asciiFloat', 5)
		attributes.push(attr)

		attr = new SensorAttribute('skip1')
		attr.addConverter('skip', 2)
		attributes.push(attr)

		attr = new SensorAttribute('temp2')
		attr.addConverter('asciiFloat', 5)
		attributes.push(attr)

		attr = new SensorAttribute('skip2')
		attr.addConverter('skip', 2)
		attributes.push(attr)

		attr = new SensorAttribute('humidity')
		attr.addConverter('asciiInteger', 4)
		attributes.push(attr)

		attr = new SensorAttribute('skip3')
		attr.addConverter('skip', 2)
		attributes.push(attr)

		attr = new SensorAttribute('pressure')
		attr.addConverter('asciiFloat', 5)
		attributes.push(attr)

		data.setBuffer(new Buffer('32332e31332c2032332e32302c20313031342c2035352e3439', 'hex'))
		data.setAttributes(attributes)
		instance.setTypes(types)
		instance.convert(data)
		expect(data.getValue('temp1')).toBe(23.13)
		expect(data.getValue('skip1')).toBe(undefined)
		expect(data.getValue('temp2')).toBe(23.2)
		expect(data.getValue('skip2')).toBe(undefined)
		expect(data.getValue('humidity')).toBe(1014)
		expect(data.getValue('skip3')).toBe(undefined)
		expect(data.getValue('pressure')).toBe(55.49)
	})
	it('should error on a too small buffer', () => {
		var data = new SensorData
		var attr = new SensorAttribute('attr1')
		attr.addConverter('uint32le')
		data.setAttributes([attr])

		data.setBuffer(new Buffer('abcd', 'hex'))

		instance.setTypes(types)
		expect(() => {
			instance.convert(data)
		}).toThrowError("Cannot convert 'attr1' (uint32le): Payload too small.")
	})

	// Constructors
	it('should use first constructor param as types', () => {
		var instance = new Converter(types)
		expect(instance.getTypes()).toBe(types)
	})
	it('should use empty object as attributes when no arguments are given', () => {
		var instance = new Converter()
		expect(instance.getTypes()).toEqual({})
	})
})
