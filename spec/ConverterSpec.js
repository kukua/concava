import Converter from '../src/Converter'
import SensorMetadata from '../src/SensorMetadata'
import SensorData from '../src/SensorData'

describe('Converter', () => {
	var instance

	var types = {
		integer (name, length) {
			length = parseInt(length)
			var value = parseInt(this.buffer.toString('hex', this.pointer, this.pointer + length), 16)

			this.pointer += length
			this.data.setValue(name, value)
		},
		ascii (name, length) {
			length = parseInt(length)
			var value = this.buffer.toString('ascii', this.pointer, this.pointer + length)

			this.pointer += length
			this.data.setValue(name, value)
		},
		asciiFloat (name, length) {
			var err = this.getType('ascii').call(this, name, length)
			if (err) return err

			var value = parseFloat(this.data.getValue(name))

			this.data.setValue(name, value)
		},
		asciiInteger (name, length) {
			var err = this.getType('ascii').call(this, name, length)
			if (err) return err

			var value = parseInt(this.data.getValue(name), 10)

			this.data.setValue(name, value)
		},
		skip (name, bits) {
			this.pointer += parseInt(bits)
		},
	}

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
	function createData (config = {}) {
		var meta = new SensorMetadata(config.attributes || [
			{
				name: 'val',
				type: '',
				value: null,
				properties: (config.properties || []),
			},
		])
		var data = new SensorData
		data.setMetadata(meta)
		data.setValue('val', (config.value !== undefined ? config.value : 100))
		return data
	}
	function createBuffer (hex) {
		return new Buffer('0000000000000001' + hex, 'hex')
	}
	it('should apply converter', () => {
		var data = createData({
			attributes: [
				{
					name: 'test1',
					type: 'integer',
					value: 4,
				},
			],
		})
		data.setBuffer(createBuffer('00000539'))
		instance.setTypes(types)
		instance.convert(data)
		expect(data.getValue('test1')).toBe(1337)
	})
	it('should have context variables', () => {
		var data = createData({
			attributes: [
				{
					name: 'test1',
					type: 'contextTester',
					value: 4,
				},
			],
		})
		data.setBuffer(createBuffer('00000539'))
		instance.setTypes({
			contextTester (name, value) {
				this.data.setValue(name, this)
			}
		})
		instance.convert(data)
		var context = data.getValue('test1')
		expect(typeof context).toBe('object')
		expect(Object.keys(context).length).toBe(4)
		expect(context.data).toEqual(jasmine.any(SensorData))
		expect(context.buffer).toEqual(jasmine.any(Buffer))
		expect(typeof context.pointer).toBe('number')
		expect(typeof context.getType).toBe('function')
	})
	it('should have pointer that starts at ninth byte', () => {
		var data = createData({
			attributes: [
				{
					name: 'test1',
					type: 'pointerTester',
					value: 4,
				},
			],
		})
		data.setBuffer(createBuffer('00000539'))
		instance.setTypes({
			pointerTester (name, value) {
				this.data.setValue(name, this.pointer)
			}
		})
		instance.convert(data)
		expect(data.getValue('test1')).toBe(8)
	})
	it('should pass name and value into converter function', () => {
		var data = createData({
			attributes: [
				{
					name: 'test1',
					type: 'fnTester',
					value: 4,
				},
			],
		})
		data.setBuffer(createBuffer('00000539'))
		instance.setTypes({
			fnTester (...args) {
				this.data.setValue(args[0], args)
			}
		})
		instance.convert(data)
		var args = data.getValue('test1')
		expect(Array.isArray(args)).toBe(true)
		expect(args.length).toBe(2)
		expect(args[0]).toBe('test1')
		expect(args[1]).toBe(4)
	})
	it('should allow chaining converters', () => {
		var data = createData({
			attributes: [
				{
					name: 'test1',
					type: 'asciiFloat',
					value: 5,
				},
			],
		})
		data.setBuffer(createBuffer('32332e3134'))
		instance.setTypes(types)
		instance.convert(data)
		expect(data.getValue('test1')).toBe(23.14)
	})
	it('should convert buffer into multiple values', () => {
		var data = createData({
			attributes: [
				{
					"name": "temp1",
					"type": "asciiFloat",
					"value": 5,
				},
				{
					"name": "skip1",
					"type": "skip",
					"value": 2,
				},
				{
					"name": "temp2",
					"type": "asciiFloat",
					"value": 5,
				},
				{
					"name": "skip2",
					"type": "skip",
					"value": 2,
				},
				{
					"name": "humidity",
					"type": "asciiInteger",
					"value": 4,
				},
				{
					"name": "skip3",
					"type": "skip",
					"value": 2,
				},
				{
					"name": "pressure",
					"type": "asciiFloat",
					"value": 5,
				},
			],
		})
		data.setBuffer(createBuffer('32332e31332c2032332e32302c20313031342c2035352e3439'))
		instance.setTypes(types)
		instance.convert(data)
		expect(data.getValue('temp1')).toBe(23.13)
		expect(data.getValue('temp2')).toBe(23.2)
		expect(data.getValue('humidity')).toBe(1014)
		expect(data.getValue('pressure')).toBe(55.49)
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
