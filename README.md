# ConCaVa Binary Payload Processor

> Convert, calibrate, and validate weather data before sending it to the Orion Context Broker.

## Checklist

- [x] Add other conversion types (now only integers are supported)
- [x] Replace `fiware-orion-client` with other library? It messes up attribute/metadata `type` values
- [x] ~~Change length (`value`) of integer type attributes to bit values (instead of bytes)? See `js/convert.js:16`~~
- [ ] Allow easy configuration (by environment variables?)
- [ ] Add validators
- [ ] Add documentation
- [ ] Add unit tests
- [ ] Pass along X-Auth-Token to Context Broker after PEP is added
- [ ] Fix inaccurate LoRa connector example payload ID (`F03D291000001180`, http://www.danvk.org/hex2dec.html)
- [ ] Add support for GZIP compression?
- [ ] Cache attributes/metadatas by payloadId?

## Notes

- Run `node test/createExamplePayload.js > test/payload.data`
- Use [HTTPie](https://github.com/jkbrzt/httpie) for HTTP requests
- `http POST 'http://localhost:3000/' 'X-Auth-Token: test' < test/payload.data`
- http://www.binaryconvert.com/convert_unsigned_int.html
- Running server locally (with CB in Docker) requires adding `<docker machine IP> context_broker` to hosts file
