export default (Server, config) => {
	var server = new Server()

	server
		.setDebugMode(config.debug)
		.setLogFile(config.logFile)
		.setLogName(config.logName)
		.setPort(config.port)
		.setPayloadMaxSize(config.payloadMaxSize)
		.setAuth(config.auth)
		.setMetadata(config.metadata)
		.setStorage(config.storage)

	return server
}
