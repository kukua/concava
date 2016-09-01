import Server from '../src/Server'
import bunyan from 'bunyan'
import connect from 'connect'

describe('Server', () => {
	var instance

	beforeEach(() => {
		instance = new Server()
	})

	it('should be a class', () => {
		expect(instance).toEqual(jasmine.any(Server))
	})

	// Setters/getters
	it('can set/get the debug mode', () => {
		expect(typeof instance.setDebugMode).toBe('function')
		expect(typeof instance.getDebugMode).toBe('function')
		var defaultValue = 0
		var testValue = 1
		expect(instance.getDebugMode()).toEqual(defaultValue)
		instance.setDebugMode(testValue)
		expect(instance.getDebugMode()).toEqual(testValue)
	})
	it('can set/get the log file', () => {
		expect(typeof instance.setLogFile).toBe('function')
		expect(typeof instance.getLogFile).toBe('function')
		var defaultValue = '/tmp/output.log'
		var testValue = '/other/file.log'
		expect(instance.getLogFile()).toEqual(defaultValue)
		instance.setLogFile(testValue)
		expect(instance.getLogFile()).toEqual(testValue)
	})
	it('can set/get the log name', () => {
		expect(typeof instance.setLogName).toBe('function')
		expect(typeof instance.getLogName).toBe('function')
		var defaultValue = 'concava'
		var testValue = 'test'
		expect(instance.getLogName()).toEqual(defaultValue)
		instance.setLogName(testValue)
		expect(instance.getLogName()).toEqual(testValue)
	})
	it('can set/get the port', () => {
		expect(typeof instance.setPort).toBe('function')
		expect(typeof instance.getPort).toBe('function')
		var defaultValue = 3000
		var testValue = 9001
		expect(instance.getPort()).toEqual(defaultValue)
		instance.setPort(testValue)
		expect(instance.getPort()).toEqual(testValue)
	})
	it('can set/get the payload max size', () => {
		expect(typeof instance.setPayloadMaxSize).toBe('function')
		expect(typeof instance.getPayloadMaxSize).toBe('function')
		var defaultValue = '512kb'
		var testValue = '16b'
		expect(instance.getPayloadMaxSize()).toEqual(defaultValue)
		instance.setPayloadMaxSize(testValue)
		expect(instance.getPayloadMaxSize()).toEqual(testValue)
	})
	it('can set/get the auth config', () => {
		expect(typeof instance.setAuth).toBe('function')
		expect(typeof instance.getAuth).toBe('function')
		var defaultValue = {}
		var testValue = { method: () => {}, test: true }
		expect(instance.getAuth()).toEqual(defaultValue)
		instance.setAuth(testValue)
		expect(instance.getAuth()).toEqual(testValue)
	})
	it('can set/get the metadata config', () => {
		expect(typeof instance.setMetadata).toBe('function')
		expect(typeof instance.getMetadata).toBe('function')
		var defaultValue = {}
		var testValue = { method: () => {}, test: true }
		expect(instance.getMetadata()).toEqual(defaultValue)
		instance.setMetadata(testValue)
		expect(instance.getMetadata()).toEqual(testValue)
	})
	it('can set/get the storage config', () => {
		expect(typeof instance.setStorage).toBe('function')
		expect(typeof instance.getStorage).toBe('function')
		var defaultValue = {}
		var testValue = { method: () => {}, test: true }
		expect(instance.getStorage()).toEqual(defaultValue)
		instance.setStorage(testValue)
		expect(instance.getStorage()).toEqual(testValue)
	})
	it('can set/get the converters', () => {
		expect(typeof instance.setConverters).toBe('function')
		expect(typeof instance.getConverters).toBe('function')
		var defaultValue = undefined
		var testValue = { foo: () => {}, bar: () => {} }
		expect(instance.getConverters()).toEqual(defaultValue)
		instance.setConverters(testValue)
		expect(instance.getConverters()).toEqual(testValue)
		instance.setConverters(false)
		expect(instance.getConverters()).toEqual(undefined)
	})
	it('can set/get the validators', () => {
		expect(typeof instance.setValidators).toBe('function')
		expect(typeof instance.getValidators).toBe('function')
		var defaultValue = undefined
		var testValue = { foo: () => {}, bar: () => {} }
		expect(instance.getValidators()).toEqual(defaultValue)
		instance.setValidators(testValue)
		expect(instance.getValidators()).toEqual(testValue)
		instance.setValidators(false)
		expect(instance.getValidators()).toEqual(undefined)
	})
	it('can set/get the logger', () => {
		expect(typeof instance.setLogger).toBe('function')
		expect(typeof instance.getLogger).toBe('function')
		var defaultValue = undefined
		var testValue = bunyan.createLogger({ name: instance.getLogName() })
		expect(instance.getLogger()).toEqual(defaultValue)
		instance.setLogger(testValue)
		expect(instance.getLogger()).toEqual(testValue)
	})
	it('can set/get the Connect app', () => {
		expect(typeof instance.setConnectApp).toBe('function')
		expect(typeof instance.getConnectApp).toBe('function')
		var defaultValue = undefined
		var testValue = connect()
		expect(instance.getConnectApp()).toEqual(defaultValue)
		instance.setConnectApp(testValue)
		expect(instance.getConnectApp()).toEqual(testValue)
	})

	// Other methods
	it('should have a createLogger method', () => {
		expect(typeof instance.createLogger).toBe('function')
	})
	it('should be able to create a Bunyan logger', () => {
		expect(instance.createLogger() instanceof bunyan).toBe(true)
	})
	it('should have a catchExceptions method', () => {
		expect(typeof instance.catchExceptions).toBe('function')
	})
	it('should have a registerMiddleware method', () => {
		expect(typeof instance.registerMiddleware).toBe('function')
	})
	it('should have a startConnectApp method', () => {
		expect(typeof instance.startConnectApp).toBe('function')
	})
	it('should have a start method', () => {
		expect(typeof instance.start).toBe('function')
	})

	// Errors
	var errors = {
		invalidPort: 'Invalid port number.',
		invalidAuth: 'Invalid auth config object.',
		invalidMetadata: 'Invalid metadata config object.',
		invalidStorage: 'Invalid storage config object.',
		invalidConverters: 'Invalid converters object.',
		invalidValidators: 'Invalid validators object.',
		invalidLogger: 'Invalid logger (not a Bunyan instance).',
	}
	it('errors on invalid port', () => {
		expect(() => { instance.setPort('test') }).toThrowError(errors.invalidPort)
		expect(() => { instance.setPort({}) }).toThrowError(errors.invalidPort)
		expect(() => { instance.setPort(-10.3) }).toThrowError(errors.invalidPort)
		expect(() => { instance.setPort(100000) }).toThrowError(errors.invalidPort)
	})
	it('errors on invalid auth config', () => {
		expect(() => { instance.setAuth('test') }).toThrowError(errors.invalidAuth)
		expect(() => { instance.setAuth({}) }).toThrowError(errors.invalidAuth)
	})
	it('errors on invalid metadata config', () => {
		expect(() => { instance.setMetadata('test') }).toThrowError(errors.invalidMetadata)
		expect(() => { instance.setMetadata({}) }).toThrowError(errors.invalidMetadata)
	})
	it('errors on invalid storage config', () => {
		expect(() => { instance.setStorage('test') }).toThrowError(errors.invalidStorage)
		expect(() => { instance.setStorage({}) }).toThrowError(errors.invalidStorage)
	})
	it('errors on invalid converters config', () => {
		expect(() => { instance.setConverters('test') }).toThrowError(errors.invalidConverters)
		expect(() => { instance.setConverters(3) }).toThrowError(errors.invalidConverters)
	})
	it('errors on invalid validators config', () => {
		expect(() => { instance.setValidators('test') }).toThrowError(errors.invalidValidators)
		expect(() => { instance.setValidators(3) }).toThrowError(errors.invalidValidators)
	})
	it('errors on invalid logger', () => {
		expect(() => { instance.setLogger('test') }).toThrowError(errors.invalidLogger)
		expect(() => { instance.setLogger({}) }).toThrowError(errors.invalidLogger)
	})
})
