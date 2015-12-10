# Installation

ConCaVa can be run as a NodeJS program or in a Docker container.

## NodeJS

```bash
git clone https://github.com/kukua/concava
cd concava
npm install
cp config.js.sample config.js
# > Edit config.js
npm start
# Should output "Listening on port X"
```

Tested with NodeJS v5.0 and NPM v3.3.

## Docker

First, [install Docker](http://docs.docker.com/engine/installation/). Then run:

```bash
curl https://raw.githubusercontent.com/kukua/concava/master/config.js.sample > config.js
# > Edit config.js
docker run -d -p 3000 -v $(pwd)/config.js:/data/config.js --name concava kukuadev/concava
docker logs concava
# Should output "Listening on port 3000"
```

The Docker container can be found [here](https://hub.docker.com/r/kukuadev/concava/).

Tested with Docker v1.8.
