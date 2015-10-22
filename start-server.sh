#!/bin/sh

if [ ! -d /src/node_modules ]; then
	npm install
fi

npm start
