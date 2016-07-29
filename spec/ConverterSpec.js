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
		expect(instance.getType('uint16le')).toBe(undefined)
		instance.setTypes(types)
		expect(instance.getType('uint16le')).toBe(types.uint16le)
		instance.setTypes({})
		expect(instance.getType('int8')).toBe(undefined)
		instance.setType('int8', types.int8)
		expect(instance.getType('int8')).toBe(types.int8)
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
		attr.addConverter('uint32be')
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
		attr.addConverter('foo')
		data.setBuffer(new Buffer('41b91eb8', 'hex'))
		instance.setTypes({
			foo (name) {
				var fn = this.getType('bar')
				expect(typeof fn).toBe('function')
				var err = fn.call(this, name)
				if (err) return err
				var val = this.data.getValue(name)
				expect(Math.round(val * 100) / 100).toBe(23.14)
				this.data.setValue(name, val * 2)
			},
			bar (name) {
				this.data.setValue(name, this.buffer.readFloatBE(0))
			},
		})
		instance.convert(data)
		expect(Math.round(data.getValue('val') * 100) / 100).toBe(46.28)
	})
	it('should convert buffer into multiple values', () => {
		var data = new SensorData
		var attributes = []
		var attr

		attr = new SensorAttribute('temp1')
		attr.addConverter('uint8')
		attributes.push(attr)

		attr = new SensorAttribute('skip1')
		attr.addConverter('skip', 2)
		attributes.push(attr)

		attr = new SensorAttribute('temp2')
		attr.addConverter('int8le')
		attributes.push(attr)

		attr = new SensorAttribute('skip2')
		attr.addConverter('skip', 2)
		attributes.push(attr)

		attr = new SensorAttribute('humidity')
		attr.addConverter('uint16be')
		attributes.push(attr)

		data.setBuffer(new Buffer('151234e9000003f6', 'hex'))
		data.setAttributes(attributes)
		instance.setTypes(types)
		instance.convert(data)
		expect(data.getValue('temp1')).toBe(21)
		expect(data.getValue('skip1')).toBe(undefined)
		expect(data.getValue('temp2')).toBe(-23)
		expect(data.getValue('skip2')).toBe(undefined)
		expect(data.getValue('humidity')).toBe(1014)
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
