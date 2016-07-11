# HTTP API endpoint

ConCaVa accepts the following HTTP requests:

- `POST /v1/sensorData`
- `PUT /v1/sensorData/<deviceID>` (where `deviceID` is a lowercase 16 character hex string)

The requests are identical, except for the device ID which using a `POST` request is prepended to the binary payload.

The following headers are required:

- `Content-Type: application/octet-stream`
- `Authorization: <auth>` (e.g. `Token abcdef0123456789abcdef0123456789`)

You can use one of these commands for testing:

```bash
echo '<deviceID><hex>' | xxd -r -p | \
	curl -i -XPOST 'http://localhost:3000/v1/sensorData' \
	-H 'Authorization: Token <token>' \
	-H 'Content-Type: application/octet-stream' --data-binary @-

echo '<hex>' | xxd -r -p | \
	curl -i -XPUT 'http://localhost:3000/v1/sensorData/<deviceID>' \
	-H 'Authorization: Token <token>' \
	-H 'Content-Type: application/octet-stream' --data-binary @-
```
