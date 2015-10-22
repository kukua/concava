# ConCaVa Binary Payload Processor

> Convert, calibrate, and validate weather data before sending it to the Orion Context Broker.

## Checklist

- [ ] Add other conversion types (now only integers are supported)
- [ ] Add validators
- [ ] Pass along X-Auth-Token to Context Broker after PEP is added
- [ ] Add tests
- [ ] Allow easy configuration
- [ ] Add documentation
- [ ] Replace `fiware-orion-client` with other library? It messes up attribute/metadata `type` values
- [ ] Change length (`value`) of integer type attributes to bit values (instead of bytes)? See `js/convert.js:16`
- [ ] Add support for GZIP compression?

## Notes

- Run `node test/createExamplePayload.js > test/payload.data`
- Use [HTTPie](https://github.com/jkbrzt/httpie) for HTTP requests
- `http POST 'http://localhost:3000/' 'X-Auth-Token: test' < test/payload.data`
- http://www.binaryconvert.com/convert_unsigned_int.html
- Running server locally (with CB in Docker) requires adding `<docker machine IP> context_broker` to hosts file
