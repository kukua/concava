#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import optimist from 'optimist'
import Server from '../Server'
import configureServer from '../configureServer'

// CLI
const pkg = require(path.resolve(__dirname, '../../package.json'))
const argv = optimist
	.usage('ConCaVa v' + pkg.version + '\n\n' +
		'Configuration driven binary payload processor for\n' +
		'Converting, Calibrating, and Validating dynamic sensor data.\n\n' +
		'For more info visit: http://kukua.github.io/concava/\n\n' +
		'Usage: $0 --config=/path/to/config.js')
	.boolean('version')
	.alias('version', 'v')
	.describe('version', 'Output version number')
	.alias('config', 'c')
	.describe('config', 'Path to config.js file  [required]')
	.argv

if (argv.version) {
	console.log(pkg.version)
	process.exit(0)
}

// Load config
if ( ! argv.config) {
	process.stdout.write(optimist.help())
	process.exit(1)
}

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
var server = configureServer(Server, config)

server.start()
