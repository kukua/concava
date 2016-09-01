import defaultConvertTypes from './types/convert'
import defaultValidateTypes from './types/validate'

const extend = require('util')._extend

export default (Server, config) => {
	var server = new Server()
	var converters = extend({}, defaultConvertTypes)
	var validators = extend({}, defaultValidateTypes)

	if (typeof config.converters === 'object') {
		converters = extend(converters, config.converters)
	}
	if (typeof config.validators === 'object') {
		validators = extend(validators, config.validators)
	}

	server
		.setDebugMode(config.debug)
		.setLogFile(config.logFile)
		.setLogName(config.logName)
		.setPort(config.port)
		.setPayloadMaxSize(config.payloadMaxSize)
		.setAuth(config.auth)
		.setMetadata(config.metadata)
		.setStorage(config.storage)
		.setConverters(converters)
		.setValidators(validators)

	return server
}
