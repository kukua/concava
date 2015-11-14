import Validator from '../src/Validator'
import SensorMetadata from '../src/SensorMetadata'
import SensorData from '../src/SensorData'

describe('Validator', () => {
	var instance

	var types = {
		min: (current, valid) => Math.max(current, valid),
		max: (current, valid) => Math.min(current, valid),
	}

	beforeEach((done) => {
		instance = new Validator
		done()
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
	function createData (config = {}) {
		var meta = new SensorMetadata([
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

	it('should not change non-attributes', (done) => {
		var data = createData()
		data.getMetadata().setAttributes([
			{
				name: 'skip1',
				type: 'skip',
				value: 2,
			},
		])
		instance.validate(data, () => {
			expect(data.getValue('val')).toBe(100)
			expect(data.getValue('skip1')).toBe(undefined)
			done()
		})
	})
	it('should ignore calibrate properties', (done) => {
		var data = createData({
			properties: [
				{
					name: 'calibrate',
					type: 'function',
					value: (val) => val * 2,
				},
			],
		})
		var obj = {}
		data.setValue('val', obj)
		instance.validate(data, () => {
			expect(data.getValue('val')).toBe(obj)
			done()
		})
	})
	it('should only change value if changes are made (dirty check)', (done) => {
		var data = createData({
			properties: [
				{
					name: 'calibrate',
					type: 'function',
					value: (val) => val * 2,
				},
				{
					name: 'invalid',
					type: '',
					value: '',
				},
			],
		})
		var obj = {}
		data.setValue('val', obj)
		instance.validate(data, () => {
			expect(data.getValue('val')).toBe(obj)
			done()
		})
	})
	it('should process min validator', (done) => {
		var data = createData({
			properties: [
				{
					name: 'min',
					type: 'integer',
					value: 110,
				},
			],
		})
		instance.setType('min', types.min)
		instance.validate(data, () => {
			expect(data.getValue('val')).toBe(110)
			done()
		})
	})
	it('should process min validator', (done) => {
		var data = createData({
			properties: [
				{
					name: 'max',
					type: 'integer',
					value: 90,
				},
			],
		})
		instance.setType('max', types.max)
		instance.validate(data, () => {
			expect(data.getValue('val')).toBe(90)
			done()
		})
	})
	it('should process multiple validators (sequentially)', (done) => {
		var data = createData({
			properties: [
				{
					name: 'plus',
					type: 'integer',
					value: 10,
				},
				{
					name: 'times',
					type: 'integer',
					value: 3,
				},
			],
		})
		instance.setTypes({
			plus: (current, value) => current + value,
			times: (current, value) => current * value,
		})
		instance.validate(data, () => {
			expect(data.getValue('val')).toBe(330)
			done()
		})
	})

	// Constructors
	it('should use first constructor param as types', () => {
		var instance = new Validator(types)
		expect(instance.getTypes()).toBe(types)
	})
	it('should use empty object as attributes when no arguments are given', () => {
		var instance = new Validator()
		expect(instance.getTypes()).toEqual({})
	})
})
