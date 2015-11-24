# ConCaVa

[![Dependency Status](https://david-dm.org/kukua/concava.svg)](https://david-dm.org/kukua)
[![Build Status](https://travis-ci.org/kukua/concava.svg?branch=master)](https://travis-ci.org/kukua/concava)

> Binary payload processor for Converting, Calibrating, and Validating dynamic sensor data.

Gathering and processing sensor data is cumbersome and has done many times already. By using dynamic metadata, ConCaVa provides a simply and robust way to convert, calibrate, and validate sensor data. By using Docker, you can have the infrastructure set up within a day, after which you can focus on the important part: working with the data. ConCaVa also provides flexible authentication and storage. For more information, see the [functional & technical introduction](https://rawgit.com/kukua/concava-intro/master/index.html).

![Dataflow](https://raw.githubusercontent.com/kukua/concava/master/doc/dataflow.png)

## Requirements

- [Docker](http://docs.docker.com/)
- [Docker Machine](https://docs.docker.com/machine/)
- [Docker Compose](http://docs.docker.com/compose/)
- [HTTPie](https://github.com/jkbrzt/httpie) (optional)

## How to use

```bash
git clone https://github.com/kukua/concava
cd concava

# Configuration
cp config.js.sample config.js
# > Edit config.js

# Mac OSX example (on Linux you can skip the docker-machine steps):
docker-machine create -d virtualbox concava
eval $(docker-machine env concava) # Must be run in every terminal tab

docker-compose up -d

# A local ConCaVa server instance can be started with:
npm install -g babel-cli
npm install
npm start

# Prepare
# > Add '<container ip> concava' to your hosts file
./tools/appendSensorMetadata.sh

# Test with:
http POST 'http://concava:3000/v1/sensorData' \
	'Authorization: Token <token from keyrock-auth>' 'Content-Type: application/octet-stream' \
	< tools/post-payload.data
http PUT 'http://concava:3000/v1/sensorData/0000000000000001' \
	'Authorization: Token <token from keyrock-auth>' 'Content-Type: application/octet-stream' \
	< tools/put-payload.data
docker-compose logs server
```

## Tests

```bash
npm test
```

## Notes

- Create example payload: `./tools/createPayload.sh '<hex>' > tools/payload.data`
- In this setup the Context Broker is __externally accessible via port 1026__!
- Access to underlying MongoDB: `docker exec -it concava_context_broker mongo orion`
