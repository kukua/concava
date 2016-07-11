# Installation

ConCaVa can be run as a NodeJS program or in a Docker container.

## NodeJS

```bash
git clone https://github.com/kukua/concava
cd concava
cp config.js.example config.js
chmod 600 config.js
# > Edit config.js

npm install
npm start
# Should show "Listening on port 3000" in log file
```

Tested with NodeJS v5.0 and NPM v3.3.

## Docker

First, [install Docker](http://docs.docker.com/engine/installation/). Then run:

```bash
curl https://raw.githubusercontent.com/kukua/concava/master/config.js.example > config.js
chmod 600 config.js
# > Edit config.js

touch /tmp/output.log

docker run -d -p 3000:3000 -v $PWD/config.js:/data/config.js \
	-v /tmp/output.log:/tmp/output.log --name concava kukuadev/concava
# Should show "Listening on port 3000" in log file
```

Tested with Docker v1.9.
