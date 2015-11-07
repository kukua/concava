#!/bin/sh

which babel-node > /dev/null || npm install -g babel-cli

if [ ! -d ./node_modules ]; then
	npm install
fi

npm start
