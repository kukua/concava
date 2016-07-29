# ConCaVa

[![Dependency Status](https://david-dm.org/kukua/concava.svg)](https://david-dm.org/kukua)
[![Build Status](https://travis-ci.org/kukua/concava.svg?branch=master)](https://travis-ci.org/kukua/concava)

> Binary payload processor for Converting, Calibrating, and Validating dynamic sensor data.

## Documentation

The project documentation is hosted on [http://kukua.github.io/concava/](http://kukua.github.io/concava/).

## Installation

ConCaVa can be run as a NodeJS program or in a Docker container.

### NodeJS

```bash
git clone https://github.com/kukua/concava
cd concava
cp config.js.example config.js
chmod 600 config.js
# > Edit config.js

npm install
npm start
# Should show "Listening on port 3000" in log file
```

Tested with NodeJS v5.0 and NPM v3.3.

### Docker

First, [install Docker](http://docs.docker.com/engine/installation/). Then run:

```bash
curl https://raw.githubusercontent.com/kukua/concava/master/config.js.example > config.js
chmod 600 config.js
# > Edit config.js

touch /tmp/output.log

docker run -d -p 3000:3000 -v $PWD/config.js:/data/config.js \
	-v /tmp/output.log:/tmp/output.log --name concava kukuadev/concava
# Should show "Listening on port 3000" in log file
```

Tested with Docker v1.9.

## Testing

First, start the ConCaVa server. Then run:

```bash
echo '000005391234' | xxd -r -p | \
	curl -i -XPUT 'http://localhost:3000/sensorData/0000000000000001' \
	-H 'Authorization: Token abcdef0123456789abcdef0123456789' \
	-H 'Content-Type: application/octet-stream' --data-binary @-
# Note: if you're using Docker, change localhost to the IP address of the container
```

## Configuration

Use [adapters](http://kukua.github.io/concava/latest/configuration/#adapters) to provide your own authentication, metadata (device configuration), and storage.
ConCaVa uses [connectors](http://kukua.github.io/concava/latest/configuration/#connectors) to support communicating through other protocols (like MQTT, LoRa, etc.).

## API

ConCaVa accepts the following HTTP requests:

- `POST /sensorData`
- `PUT /sensorData/<deviceID>` (where `deviceID` is a lowercase 16 character hex string)

The requests are identical, except for the device ID which using a `POST` request is prepended to the binary payload.

The following headers are required:

- `Content-Type: application/octet-stream`
- `Authorization: <auth>` (e.g. `Token abcdef0123456789abcdef0123456789`)

You can use one of these commands for testing:

```bash
echo '<deviceID><hex>' | xxd -r -p | \
	curl -i -XPOST 'http://localhost:3000/sensorData' \
	-H 'Authorization: Token <token>' \
	-H 'Content-Type: application/octet-stream' --data-binary @-

echo '<hex>' | xxd -r -p | \
	curl -i -XPUT 'http://localhost:3000/sensorData/<deviceID>' \
	-H 'Authorization: Token <token>' \
	-H 'Content-Type: application/octet-stream' --data-binary @-
```

## Contribute

Your help and feedback is highly appreciated! Please make sure the tests pass before submitting a pull request.

```bash
git clone https://github.com/kukua/concava
cd concava
cp config.js.example config.js
chmod 600 config.js
# > Edit config.js

npm install
npm test
```

## License

This software is licensed under the [MIT license](https://github.com/kukua/concava/blob/master/LICENSE).

© 2016 Kukua BV
