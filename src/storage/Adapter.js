/*eslint no-unused-vars: [2, {"args": "after-used", "argsIgnorePattern": "^cb$"}]*/

export default class Adapter {
	constructor (config) {
		this.setConfig(config || {})
	}
	setConfig (config) {
		this._config = config
	}
	getConfig () {
		return this._config
	}
	setSensorMetadata (authToken, data, cb) {
		throw new Error('Not implemented')
	}
	insertSensorData (authToken, data, fallbackDate, cb) {
		throw new Error('Not implemented')
	}
}
