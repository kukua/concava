import SensorData from '../src/SensorData'
import SensorMetadata from '../src/SensorMetadata'

describe('SensorData', () => {
	var errors = {
		buffer: {
			invalid: 'Invalid Buffer given.',
			tooSmall: 'Buffer contains less than 8 bytes.',
		},
		metadata: {
			invalid: 'Invalid SensorMetadata given.',
		},
	}
	var data

	beforeEach((done) => {
		data = new SensorData
		done()
	})

	it('should be a class', () => {
		expect(data).toEqual(jasmine.any(SensorData))
	})

	// Setters/getters
	it('can set/get a buffer', () => {
		expect(typeof data.setBuffer).toBe('function')
		expect(typeof data.getBuffer).toBe('function')
		var buffer = new Buffer([ 0, 1, 2, 3, 4, 5, 6, 7 ])
		expect(data.getBuffer()).toBe(undefined)
		data.setBuffer(buffer)
		expect(data.getBuffer()).toBe(buffer)
	})
	it('can extract the device id from the buffer', () => {
		expect(typeof data.getDeviceId).toBe('function')
		var id = 'ABCDEF0123456789'
		var buffer = new Buffer(id, 'hex')
		expect(data.getDeviceId()).toBe(undefined)
		data.setBuffer(buffer)
		expect(data.getDeviceId()).not.toBe(id)
		expect(data.getDeviceId()).toBe(id.toLowerCase())
	})
	it('can set/get a data object', () => {
		expect(typeof data.setData).toBe('function')
		expect(typeof data.getData).toBe('function')
		var values = { a: 1, b: 2 }
		data.setData(values)
		expect(data.getData()).toBe(values)
		var values2 = { c: 'OVER', d: 9000 }
		data.setData(values2)
		expect(data.getData()).toBe(values2)
	})
	it('can set/get individual data values', () => {
		expect(typeof data.setValue).toBe('function')
		expect(typeof data.getValue).toBe('function')
		var values = { a: 1, b: 2 }
		data.setValue('a', undefined)
		data.setValue('b', undefined)
		data.setData(values)
		expect(data.getData()).toBe(values)
		data.setValue('a', 10)
		expect(data.getValue('a')).toBe(10)
		data.setValue('b', undefined)
		expect(data.getValue('b')).toBe(undefined)
		var instance = new Array()
		data.setValue('c', instance)
		expect(data.getValue('c')).toBe(instance)
	})
	it('can set/get a metadata instance', () => {
		expect(typeof data.setMetadata).toBe('function')
		expect(typeof data.getMetadata).toBe('function')
		var metadata = new SensorMetadata()
		expect(data.getMetadata()).toBe(undefined)
		data.setMetadata(metadata)
		expect(data.getMetadata()).toBe(metadata)
	})

	// Errors
	var errors = {
		buffer: {
			invalid: 'Invalid Buffer given.',
			tooSmall: 'Buffer contains less than 8 bytes.',
		},
		metadata: {
			invalid: 'Invalid SensorMetadata given.',
		},
	}

	it('errors on invalid buffer', () => {
		expect(() => { data.setBuffer(undefined) }).toThrowError(errors.buffer.invalid)
		expect(data.getBuffer()).toBe(undefined)
		expect(() => { data.setBuffer(3) }).toThrowError(errors.buffer.invalid)
		expect(data.getBuffer()).toBe(undefined)
		expect(() => { data.setBuffer({}) }).toThrowError(errors.buffer.invalid)
		expect(data.getBuffer()).toBe(undefined)
		expect(() => { data.setBuffer({}) }).toThrowError(errors.buffer.invalid)
		expect(data.getBuffer()).toBe(undefined)

		expect(() => { data.setBuffer(new Buffer('')) }).toThrowError(errors.buffer.tooSmall)
		expect(data.getBuffer()).toBe(undefined)
		expect(() => { data.setBuffer(new Buffer('ABCDEF', 'hex')) }).toThrowError(errors.buffer.tooSmall)
		expect(data.getBuffer()).toBe(undefined)
	})
	it('errors on invalid metadata', () => {
		var err = 'Invalid SensorMetadata given.'
		expect(() => { data.setMetadata(undefined) }).toThrowError(err)
		expect(data.getMetadata()).toBe(undefined)
		expect(() => { data.setMetadata(3) }).toThrowError(err)
		expect(data.getMetadata()).toBe(undefined)
		expect(() => { data.setMetadata({}) }).toThrowError(err)
		expect(data.getMetadata()).toBe(undefined)
	})

	// Constructors
	it('should use first constructor param as buffer', () => {
		var buffer = new Buffer('ABCDEF0123456789')
		var data = new SensorData(buffer)
		expect(data.getBuffer()).toBe(buffer)
	})
	it('should set data to empty object', () => {
		var data = new SensorData
		expect(data.getData()).toEqual({})
	})
})
