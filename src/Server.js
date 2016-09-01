import http from 'http'
import connect from 'connect'
import bunyan from 'bunyan'
import verifyRequest from './middleware/verifyRequest'
import parsePayload from './middleware/parsePayload'
import createSensorData from './middleware/createSensorData'
import authenticate from './middleware/authenticate'
import setMetadata from './middleware/setMetadata'
import { convert, calibrate, validate } from './middleware/concava'
import debug from './middleware/debug'
import store from './middleware/store'
import errorHandler from './middleware/errorHandler'

export default class Server {
	constructor () {
		this._debug = 0
		this._logFile = '/tmp/output.log'
		this._logName = 'concava'
		this._port = 3000
		this._payloadMaxSize = '512kb'
	}
	setDebugMode (debug) {
		this._debug = (debug ? 1 : 0)
		return this
	}
	getDebugMode () {
		return this._debug
	}
	setLogFile (file) {
		this._logFile = '' + file
		return this
	}
	getLogFile () {
		return this._logFile
	}
	setLogName (name) {
		this._logName = '' + name
		return this
	}
	getLogName () {
		return this._logName
	}
	setPort (port) {
		port = parseInt(port)

		if (isNaN(port) || port < 0 || port > 65535) {
			throw new Error('Invalid port number.')
		}

		this._port = port
		return this
	}
	getPort () {
		return this._port
	}
	setPayloadMaxSize (size) {
		this._payloadMaxSize = '' + size
		return this
	}
	getPayloadMaxSize () {
		return this._payloadMaxSize
	}
	setAuth (auth) {
		if (typeof auth !== 'object'
			|| typeof auth.method !== 'function') {
			throw new Error('Invalid auth config object.')
		}

		this._auth = auth
		return this
	}
	getAuth () {
		return this._auth || {}
	}
	setMetadata (metadata) {
		if (typeof metadata !== 'object'
			|| typeof metadata.method !== 'function') {
			throw new Error('Invalid metadata config object.')
		}

		this._metadata = metadata
		return this
	}
	getMetadata () {
		return this._metadata || {}
	}
	setStorage (storage) {
		if (typeof storage !== 'object'
			|| typeof storage.method !== 'function') {
			throw new Error('Invalid storage config object.')
		}

		this._storage = storage
		return this
	}
	getStorage () {
		return this._storage || {}
	}
	setLogger (logger) {
		if ( ! (logger instanceof bunyan)) {
			throw new Error('Invalid logger (not a Bunyan instance).')
		}
		this._logger = logger
		return this
	}
	getLogger () {
		return this._logger
	}
	createLogger () {
		var file = this.getLogFile()

		this.setLogger(bunyan.createLogger({
			name: this.getLogName(),
			streams: [
				{ level: 'warn', stream: process.stdout },
				{ level: (this.getDebugMode() ? 'debug' : 'info'), path: file }
			]
		}))

		return this.getLogger()
	}
	setConnectApp (app) {
		this._app = app
		return this
	}
	getConnectApp () {
		return this._app
	}
	catchExceptions () {
		var log = this.getLogger()

		process.on('uncaughtException', (err) => {
			log.error({ type: 'uncaught-exception', stack: err.stack }, '' + err)
		})
	}
	registerMiddleware () {
		var app = this.getConnectApp()
		var log = this.getLogger()

		app.use((req, res, next) => {
			req.start = new Date()
			req.log = log
			next()
		})

		app.use(verifyRequest())
		app.use(parsePayload())
		app.use(createSensorData())
		app.use(authenticate(this.getAuth()))
		app.use(setMetadata(this.getMetadata()))
		app.use(convert())
		app.use(calibrate())
		app.use(validate())
		app.use(debug(this.getDebugMode()))
		app.use(store(this.getStorage()))
		app.use(errorHandler(this.getAuth().byToken))

		// End request
		app.use((req, res, next) => {
			res.end()
			next()
		})
	}
	startConnectApp () {
		var app  = this.getConnectApp()
		var port = this.getPort()
		var log  = this.getLogger()

		http.createServer(app).listen(port)
		log.warn({ type: 'start', port }, `Listening on port ${port}.`)
	}
	start () {
		this.setConnectApp(connect())
		this.createLogger()
		this.catchExceptions()
		this.registerMiddleware()
		this.startConnectApp()
	}
}
