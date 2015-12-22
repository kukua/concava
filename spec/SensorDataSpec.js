import SensorData from '../src/SensorData'
import SensorAttribute from '../src/SensorAttribute'

describe('SensorData', () => {
	var data

	beforeEach((done) => {
		data = new SensorData
		done()
	})

	it('should be a class', () => {
		expect(data).toEqual(jasmine.any(SensorData))
	})

	// Setters/getters
	it('can set/get the device id', () => {
		expect(typeof data.setDeviceId).toBe('function')
		expect(typeof data.getDeviceId).toBe('function')
		expect(data.getDeviceId()).toBe(undefined)
		var invalidId = '123!'
		expect(data.setDeviceId(invalidId)).toBe(false)
		expect(data.getDeviceId()).toBe(undefined)
		var id = 'ABCDEF0123456789'
		expect(data.setDeviceId(id)).toBe(true)
		expect(data.getDeviceId()).not.toBe(id)
		expect(data.getDeviceId()).toBe(id.toLowerCase())
	})
	it('can set/get a buffer', () => {
		expect(typeof data.setBuffer).toBe('function')
		expect(typeof data.getBuffer).toBe('function')
		var buffer = new Buffer([ 0, 1, 2, 3, 4, 5, 6, 7 ])
		expect(data.getBuffer()).toBe(undefined)
		data.setBuffer(buffer)
		expect(data.getBuffer()).toBe(buffer)
	})
	it('can set/get a data object', () => {
		expect(typeof data.setData).toBe('function')
		expect(typeof data.getData).toBe('function')
		expect(data.getData()).toEqual({})
		var values = { a: 1, b: 2 }
		data.setData(values)
		expect(data.getData()).toBe(values)
		var values2 = { c: 'OVER', d: 9000 }
		data.setData(values2)
		expect(data.getData()).toBe(values2)
	})
	it('can set/get attributes', () => {
		expect(typeof data.setAttributes).toBe('function')
		expect(typeof data.getAttributes).toBe('function')
		expect(data.getAttributes()).toEqual([])
		var attributes = [new SensorAttribute]
		data.setAttributes(attributes)
		expect(data.getAttributes()).toBe(attributes)
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
	it('should set the raw buffer as hex value', () => {
		var buffer = new Buffer([ 0, 1, 2, 3, 4, 5, 6, 7 ])
		data.setBuffer(buffer)
		expect(data.getValue('_raw')).toBe('0001020304050607')
		buffer = new Buffer('000005391234', 'hex')
		data.setBuffer(buffer)
		expect(data.getValue('_raw')).toBe('000005391234')
	})

	// Errors
	var errors = {
		invalidBuffer: 'Invalid Buffer given.',
		emptyBuffer: 'Empty Buffer given.',
	}
	it('errors on invalid buffer', () => {
		expect(() => { data.setBuffer(undefined) }).toThrowError(errors.invalidBuffer)
		expect(data.getBuffer()).toBe(undefined)
		expect(() => { data.setBuffer(3) }).toThrowError(errors.invalidBuffer)
		expect(data.getBuffer()).toBe(undefined)
		expect(() => { data.setBuffer({}) }).toThrowError(errors.invalidBuffer)
		expect(data.getBuffer()).toBe(undefined)
		expect(() => { data.setBuffer({}) }).toThrowError(errors.invalidBuffer)
		expect(data.getBuffer()).toBe(undefined)

		expect(() => { data.setBuffer(new Buffer('', 'hex')) }).toThrowError(errors.emptyBuffer)
		expect(data.getBuffer()).toBe(undefined)
	})

	// Constructors
	it('should use first constructor param as device ID', () => {
		var id = 'abcdef0123456789'
		var data = new SensorData(id)
		expect(data.getDeviceId()).toBe(id)
	})
	it('should use second constructor param as buffer', () => {
		var buffer = new Buffer('ABCDEF0123456789')
		var data = new SensorData(undefined, buffer)
		expect(data.getBuffer()).toBe(buffer)
	})
})
