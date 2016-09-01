#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import Server from '../Server'

// CLI
const argv = require('optimist')
	.usage('Configuration driven binary payload processor for\n' +
		'Converting, Calibrating, and Validating dynamic sensor data.\n\n' +
		'Usage: $0 --config=/path/to/config.js')
	.demand('config')
	.alias('config', 'c')
	.describe('config', 'Path to config.js file')
	.argv

// Load config
const configFile = path.resolve(argv.config)

if ( ! fs.existsSync(configFile)) {
	console.error('Configuration file does not exist:', configFile)
	process.exit(1)
}

try {
	var config = require(path.resolve(argv.config))
} catch (ex) {
	console.error('Configuration file cannot be loaded:')
	console.error(ex.toString())
	process.exit(1)
}

// Boostrap server
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

server.start()
