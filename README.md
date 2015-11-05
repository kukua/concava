# ConCaVa Binary Payload Processor

> Convert, calibrate, and validate weather data before sending it to the Orion Context Broker.

## Dependencies

- [Docker](http://docs.docker.com/)
- [Docker Machine](https://docs.docker.com/machine/)
- [Docker Compose](http://docs.docker.com/compose/)
- [HTTPie](https://github.com/jkbrzt/httpie) (optional)

## How to use

```bash
# Mac OSX example (on Linux you can skip the docker-machine steps):
docker-machine create -d virtualbox concava
eval $(docker-machine env concava) # Must be run in every terminal tab

docker-compose up -d
# A local ConCaVa server instance can be started with: $ npm start

# Prepare
# > Add '<container ip> concava' to your hosts file
./test/appendSensorMetadata.sh

# Test with:
http POST 'http://concava:3000/' 'X-Auth-Token: test' < test/payload.data
docker-compose logs server
```

## Notes

- Create example payload: `node test/createExamplePayload.js > test/payload.data`
- Access to underlying MongoDB: `docker exec -it concava_context_broker_1 mongo orion`
