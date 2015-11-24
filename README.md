# ConCaVa

[![Dependency Status](https://david-dm.org/kukua/concava.svg)](https://david-dm.org/kukua)
[![Build Status](https://travis-ci.org/kukua/concava.svg?branch=master)](https://travis-ci.org/kukua/concava)

> Binary payload processor for Converting, Calibrating, and Validating dynamic sensor data.

Gathering and processing sensor data is cumbersome and has done many times already. By using dynamic metadata, ConCaVa provides a simply and robust way to convert, calibrate, and validate sensor data. By using Docker, you can have the infrastructure set up within a day, after which you can focus on the important part: working with the data. ConCaVa also provides flexible authentication and storage. For more information, see the [functional & technical introduction](https://rawgit.com/kukua/concava-intro/master/index.html).

![Dataflow](https://raw.githubusercontent.com/kukua/concava/master/doc/dataflow.png)

## How to use

```bash
docker run -d -p 3000 -v /path/to/config.js:/data/config.js kukuadev/concava
```

## Example

```bash
http POST 'http://<container IP>:3000/v1/sensorData' \
	'Authorization: Token <token>' 'Content-Type: application/octet-stream' \
	< deviceID-and-payload.bin
http PUT 'http://<container IP>:3000/v1/sensorData/0000000000000001' \
	'Authorization: Token <token>' 'Content-Type: application/octet-stream' \
	< bare-payload.bin
```

In these examples [HTTPie](https://github.com/jkbrzt/httpie) is used.

## Contribute

Your help and feedback is highly welcome! Please make sure the test pass before submitting a pull request.

```bash
git clone https://github.com/kukua/concava
cd concava
npm install
npm test
```
