# ConCaVa Binary Payload Processor

[![Dependency Status](https://david-dm.org/kukua/concava.svg)](https://david-dm.org/kukua)
[![Build Status](https://travis-ci.org/kukua/concava.svg?branch=master)](https://travis-ci.org/kukua/concava)

> Convert, calibrate, and validate weather data before sending it to the Orion Context Broker.

## Dependencies

- [Docker](http://docs.docker.com/)
- [Docker Machine](https://docs.docker.com/machine/)
- [Docker Compose](http://docs.docker.com/compose/)
- [HTTPie](https://github.com/jkbrzt/httpie) (optional)

## How to use

```bash
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

- In this setup the Context Broker is __externally accessible via port 1026__!
- Create example payload: `./tools/createExamplePayload.sh '<hex>' > tools/payload.data`
- Access to underlying MongoDB: `docker exec -it concava_context_broker mongo orion`
