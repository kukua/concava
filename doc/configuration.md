# Configuration

The ConCaVa repository contains a [config.js.example file](https://github.com/kukua/concava/blob/master/config.js.example), containing all the configuration options.

## Adapters

ConCaVa allows you to provide your own authentication, metadata (device configuration), and storage. These are down through generic adapters.
Adapters are simply asynchronous JavaScript functions. Each of these adapter functions accepts four or five arguments:

```js
// req = Express request
// config = auth, metadata, or storage object from config.js
// data = SensorData instance
// classes = { SensorData, SensorAttribute }
// cb = callback function

function (req, config, data, cb) {}
function (req, config, data, classes, cb) {}
```

The latter is used for providing metadata with the classes used by ConCaVa.

### Authentication

Example authentication adapter:

```js
function auth (req, config, data, cb) {
	// return cb() // To disable authentication

	console.log(req.auth) // { udid: '...', token: '...' }
	// token will only be added if config.byToken === true

	var user = { id: 1, name: 'User 1' }
	cb(null, user)
	// The value of user is assigned to req.user
}
```


### Metadata

Example metadata adapter:

```js
function metadata (req, config, data, classes, cb) {
	// data is instance of classes.SensorData
	if (data.getDeviceId() !== '0000000000000001') {
		return cb('No metadata for device.')
	}

	var attr1 = new classes.SensorAttribute('attr1')
	attr1.addConverter('uint32be')
	attr1.addValidator('min', 100)
	attr1.addValidator('max', 1300)

	var attr2 = new classes.SensorAttribute('attr2')
	attr2.addConverter('int16le')
	attr2.addCalibrator('return value + 7')

	data.setAttributes([attr1, attr2])
	cb()
}
```

### Storage

Example storage adapter:

```js
function storage (req, config, data, cb) {
	var udid = data.getDeviceId()

	console.log(udid, data.getData())
	cb()
}
```

<div class="admonition note">
	<p class="first admonition-title">Note</p>
	<p class="last">In debug mode, ConCaVa will also write the data to the log file.</p>
</div>

### Available

The following adapters are available:

- [MySQL authentication, metadata, and storage](https://github.com/kukua/node-concava-adapter-mysql)
- [Orion Context Broker authentication, metadata, and storage](https://github.com/kukua/concava-setup-context-broker)
- [MQTT storage](https://github.com/kukua/node-concava-adapter-mqtt)
- [InfluxDB storage](https://github.com/kukua/node-concava-adapter-influxdb)

[Search for 'adapter' on Github](https://github.com/kukua/?utf8=%E2%9C%93&query=adapter) to see all official adapters.
Contributing other adapters is highly appreciated. See [the contributing page](contributing.md#adapters) for more information.

## Connectors

Connectors are used to support other communication protocols. They act as a proxy for ConCaVa. A connector extracts the UDID and binary payload from protocol packet of your liking. For example: the MQTT connector provides an MQTT broker that uses the `clientId` and `password` configuration options for UDID and auth token. Any data it receives will used as binary payload to forward to ConCaVa.

### Available

The following connectors are available:

- [LoRa](https://github.com/kukua/concava-connector-lora). Handles LoRa XML (from a KPN server webhook for example).
- [LoRa TTN](https://github.com/kukua/concava-connector-ttn). Handles The Things Network LoRa packets.
- [MQTT](https://github.com/kukua/concava-connector-mqtt).
- [SPUL](https://github.com/kukua/concava-connector-spul) stands for _Sensor Protocol Ultra Light_. Documentation can be [found here](http://kukua.github.io/concava-connector-spul/).

[Search for 'ConCaVa' on the Docker Hub](https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=concava&starCount=0) to see all connectors.
Contributing other connectors is highly appreciated. See [the contributing page](contributing.md#connectors) for more information.
