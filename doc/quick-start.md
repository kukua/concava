# Quick Start

By following these steps you will setup ConCaVa using the built in JSON adapter.
This means the authentication, metadata, and storage will be loaded from JSON files. This tutorial assumes you know how to use Bash on a Unix or Linux environment.

## Setup

[Install Docker](http://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/). Then run the following commands:

```bash
mkdir my-concava
cd my-concava

curl https://raw.githubusercontent.com/kukua/concava/master/config.js.example > config.js
chmod 600 config.js

touch output.log docker-compose.yml
mkdir data
touch data/tokens.json data/metadata.json
```

Copy the following text into the `docker-compose.yml` file:

```yml
concava:
    image: kukuadev/concava
    ports:
        - "3000:3000"
    volumes:
        - ./config.js:/data/config.js:ro
        - ./output.log:/tmp/output.log
        - ./data/:/data/data
```

With this configuration file we can easily create the container:

```bash
docker-compose up -d
```

That's it! We now have ConCaVa running on port 3000.

## Send data

Next, we'll send device data to ConCaVa. For this we need the following:

```
UDID           The unique device ID (16 lowercase hex characters),
               for example: 0000000000000001
Auth header    The authentication header,
               for example: Token abcdef0123456789abcdef0123456789
Payload        The measured data, normally in binary,
               but for this example as a hex string
```

We'll use the following sensor specification:

<table>
	<thead>
		<tr>
			<th>Measurement</th>
			<th>Value</th>
			<th>Actual data</th>
			<th>Converter</th>
			<th>Calibrator</th>
			<th>Validators</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Temperature</td>
			<td>23.4 °C</td>
			<td>234</td>
			<td>int16le</td>
			<td>return val / 10</td>
			<td>min=-40 max=85</td>
		</tr>
		<tr>
			<td>Pressure</td>
			<td>1017.9 hPa</td>
			<td>10179</td>
			<td>uint16le</td>
			<td>return val / 10</td>
			<td>min=300 max=1100</td>
		</tr>
		<tr>
			<td>Humidity</td>
			<td>38.7 %</td>
			<td>387</td>
			<td>uint16le</td>
			<td>return val / 10</td>
			<td>min=0 max=100</td>
		</tr>
		<tr>
			<td>Latitude</td>
			<td>52.0842715</td>
			<td>52.0842715</td>
			<td>floatle</td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td>Longitude</td>
			<td>5.0124524</td>
			<td>5.0124524</td>
			<td>floatle</td>
			<td></td>
			<td></td>
		</tr>
	</tbody>
</table>

For temperature, pressure, and humidity using floats is inefficient (`3 x 4 bytes = 12 bytes`). Instead we fix the value to one decimal number and multiply it by 10 and later divide it by 10 again. This allows us to use 16 bit integers (2 bytes per value) or `3 x 2 = 6 bytes` in total. This cuts our number of bytes in half!

In this tutorial we also send the device's GPS coordinates.a latitude and longitude.

It is common to use the [Little Endian](https://en.wikipedia.org/wiki/Endianness) byte order when sending data from devices. This means the little end (byte with smallest part of value) comes first.

Translating these values to a hexadecimal payload looks like this:

```
Temperature    0xea00
Pressure       0xc327
Humidity       0x8301
Latitude       0x4b565042
Longitude      0x0366a040

Final payload  0xea00c32783014b5650420366a040
```

Send this to ConCaVa by running:

```bash
echo 'ea00c32783014b5650420366a040' | xxd -r -p | \
	curl -i -XPUT 'http://localhost:3000/v1/sensorData/0000000000000001' \
	-H 'Authorization: Token abcdef0123456789abcdef0123456789' \
	-H 'Content-Type: application/octet-stream' --data-binary @-
```

The response will look like this:

```
HTTP/1.1 401 Unauthorized
Allow: HEAD, POST, PUT
Accept: application/octet-stream
WWW-Authenticate: Token
Date: Mon, 11 Jul 2016 13:30:16 GMT
Connection: keep-alive
Transfer-Encoding: chunked

Unauthorized token.
```

Success! Sort of. We need to configure ConCaVa to be able to handle the request.

## Add tokens

Now we add our token to `data/tokens.json`:

```json
{
	"abcdef0123456789abcdef0123456789": {
		"id": 1,
		"name": "User 1"
	}
}
```

Here you see the unique authentication token as the key and the user data object as the value. Run the `curl` request again, the response will look like this:

```
HTTP/1.1 400 Bad Request
Allow: HEAD, POST, PUT
Accept: application/octet-stream
Date: Mon, 11 Jul 2016 13:34:40 GMT
Connection: keep-alive
Transfer-Encoding: chunked

No metadata for 0000000000000001.
```

Again, success! But no data yet. We need to add the metadata for this specific device.

## Add metadata

Add this metadata to `data/metadata.json`:

```json
{
	"0000000000000001": [
		{
			"name": "temperature",
			"converters": ["int16le"],
			"calibrators": ["return val / 10"],
			"validators": [
				["min", -40],
				["max", 85]
			]
		},
		{
			"name": "pressure",
			"converters": ["uint16le"],
			"calibrators": ["return val / 10"],
			"validators": [
				["min", 300],
				["max", 1100]
			]
		},
		{
			"name": "humidity",
			"converters": ["uint16le"],
			"calibrators": ["return val / 10"],
			"validators": [
				["min", 0],
				["max", 100]
			]
		},
		{
			"name": "lat",
			"converters": ["floatle"],
			"calibrators": [],
			"validators": []
		},
		{
			"name": "lng",
			"converters": ["floatle"],
			"calibrators": [],
			"validators": []
		}
	]
}
```

This is the JSON adapter format for the metadata in the table you saw earlier. Compare them to see that we used the exact same configuration.

Third time's the charm: run the `curl` request again. The response should be:

```
HTTP/1.1 200 OK
Allow: HEAD, POST, PUT
Accept: application/octet-stream
Date: Mon, 11 Jul 2016 13:49:03 GMT
Connection: keep-alive
Content-Length: 0
```

Success! But how do we view the data?

## Stored measurements

Open `data/store.0000000000000001.json` to show the data, which looks like this:

```json
{
  "b6a84c4e-8014-4681-b78b-89a7c1c97a86": {
    "_raw": "ea00c32783014b5650420366a040",
    "temperature": 23.4,
    "pressure": 1017.9,
    "humidity": 38.7,
    "lat": 52.08427047729492,
    "lng": 5.012452602386475,
    "timestamp": 1468244943
  }
}
```

<div class="admonition note">
	<p class="first admonition-title">Tip</p>
	<p class="last">Use <a href="https://stedolan.github.io/jq/tutorial/" target="_blank">jq</a> for displaying JSON data.</p>
</div>
