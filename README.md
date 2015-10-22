# ConCaVa Binary Payload Processor

> Convert, calibrate, and validate weather data before sending it to the Orion Context Broker.

## Notes

- Run `node test/createExamplePayload.js > test/payload.data`
- Use [HTTPie](https://github.com/jkbrzt/httpie) for HTTP requests
- `http POST 'http://localhost:3000/' 'X-Auth-Token: test' < test/payload.data`
- http://www.binaryconvert.com/convert_unsigned_int.html
- Running server locally (with CB in Docker) requires adding `<docker machine IP> context_broker` to hosts file
