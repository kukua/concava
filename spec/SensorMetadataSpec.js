import SensorMetadata from '../src/SensorMetadata'
import SensorAttribute from '../src/SensorAttribute'

describe('SensorMetadata', () => {
	var metadata

	beforeEach((done) => {
		metadata = new SensorMetadata
		done()
	})

	it('should be a class', () => {
		expect(metadata).toEqual(jasmine.any(SensorMetadata))
	})

	// Setters/getters
	var attributes = [
		new SensorAttribute({ name: 'a', type: 'string', value: 'hello' }),
		new SensorAttribute({ name: 'b', type: 'integer', value: 3 }),
		new SensorAttribute({ name: 'c', type: 'float', value: 3.3 }),
	]
	it('can set/get an attributes array', () => {
		expect(typeof metadata.setAttributes).toBe('function')
		expect(typeof metadata.getAttributes).toBe('function')
		metadata.setAttributes(attributes)
		expect(metadata.getAttributes()).toEqual(attributes)
	})
	it('can get an attribute', () => {
		expect(typeof metadata.getAttribute).toBe('function')
		expect(metadata.getAttribute('a')).toBe(undefined)
		expect(metadata.getAttribute('b')).toBe(undefined)
		expect(metadata.getAttribute('c')).toBe(undefined)
		metadata.setAttributes(attributes)
		expect(metadata.getAttribute('a')).toBe(attributes[0])
		expect(metadata.getAttribute('b')).toBe(attributes[1])
		expect(metadata.getAttribute('c')).toBe(attributes[2])
		expect(metadata.getAttribute('d')).toBe(undefined)
	})
	it('can get an attribute type', () => {
		expect(typeof metadata.getAttribute).toBe('function')
		expect(metadata.getAttributeType('a')).toBe(undefined)
		expect(metadata.getAttributeType('b')).toBe(undefined)
		expect(metadata.getAttributeType('c')).toBe(undefined)
		metadata.setAttributes(attributes)
		expect(metadata.getAttributeType('a')).toBe(attributes[0].getType())
		expect(metadata.getAttributeType('b')).toBe(attributes[1].getType())
		expect(metadata.getAttributeType('c')).toBe(attributes[2].getType())
		expect(metadata.getAttributeType('d')).toBe(undefined)
	})

	// Constructors
	it('should use first constructor param as attributes', () => {
		var metadata = new SensorMetadata(attributes)
		expect(metadata.getAttributes()).toEqual(attributes)
	})
	it('should use empty array as attributes when no arguments are given', () => {
		var metadata = new SensorMetadata()
		expect(metadata.getAttributes()).toEqual([])
	})
})
