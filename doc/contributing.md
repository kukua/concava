# Contributing

Your help or feedback is highly appreciated! Please do so by creating an issue in the [Github repository](https://github.com/kukua/concava/issues).

When contributing code, please make sure the tests pass:

```
git clone https://github.com/kukua/concava
cd concava
npm install
npm test
```

You can also contact use via email at [dev@kukua.cc](mailto:dev@kukua.cc).

## Adapters

To write your own adapter, use the function templates from the [configuration page](configuration.md#adapters). The official adapters are published as [modules on NPM](https://www.npmjs.com/search?q=concava-adapter). The module name should be prefixed with `concava-adapter-`.

You can use the [MySQL adapter code](https://github.com/kukua/node-concava-adapter-mysql) as a starting point to write your own.

## Connectors

Follow these steps to create a connector for the protocol you wish to use:

1. Make sure the connector [isn't already available](configuration.md#connectors).
1. Create a listener service for your protocol
1. When receiving new data collect the UDID, binary payload, and optionally the authorization header/token
1. Do a HTTP request to ConCaVa. See the [API documentation](api.md) for details.
1. Publish on Docker Hub. The image name should be prefixed with `concava-connector-`.

You can use the [LoRa for The Things Network connector code](https://github.com/kukua/concava-connector-ttn) as a starting point to write your own.
