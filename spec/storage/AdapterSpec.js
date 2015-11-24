import Adapter from '../../src/storage/Adapter'
import SensorData from '../../src/SensorData'

describe('Adapter', () => {
	var adapter

	var config = { a: 1, b: 2 }

	beforeEach((done) => {
		adapter = new Adapter
		done()
	})

	it('should be a class', () => {
		expect(adapter).toEqual(jasmine.any(Adapter))
	})

	// Setters/getters
	it('can set/get a config object', () => {
		expect(typeof adapter.setConfig).toBe('function')
		expect(typeof adapter.getConfig).toBe('function')
		expect(adapter.getConfig()).toEqual({})
		adapter.setConfig(config)
		expect(adapter.getConfig()).toBe(config)
	})

	// Methods
	it('should have a setSensorMetadata method', () => {
		expect(typeof adapter.setSensorMetadata).toBe('function')
		var data = new SensorData
		expect(() => { adapter.setSensorMetadata('ABC', data, (err) => {}) }).toThrowError('Not implemented')
	})
	it('should have a insertSensorData method', () => {
		expect(typeof adapter.insertSensorData).toBe('function')
		var data = new SensorData
		var date = new Date()
		expect(() => { adapter.insertSensorData('ABC', data, date, (err) => {}) }).toThrowError('Not implemented')
	})

	// Constructors
	it('should use first constructor param as config', () => {
		expect(adapter.getConfig()).toEqual({})
		adapter = new Adapter(config)
		adapter.setConfig(config)
		expect(adapter.getConfig()).toBe(config)
	})
})
