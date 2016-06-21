# Testing

First, start the ConCaVa server. Then run:

```bash
echo '000005391234' | xxd -r -p | \
	curl -i -XPOST 'http://localhost:3000/v1/sensorData/0000000000000001' \
	-H 'Authorization: Token abcdef0123456789abcdef0123456789' \
	-H 'Content-Type: application/octet-stream' --data-binary @-
# Note: if you're using Docker, change localhost to the IP address of the container
```
