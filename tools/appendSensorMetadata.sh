#!/bin/sh

(curl concava:1026/v1/updateContext -s -S --header 'Content-Type: application/json' \
    --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
	"contextElements": [
		{
			"type": "SensorMetadata",
			"isPattern": "false",
			"id": "0000000000000001",
			"attributes": [
				{
					"name": "attr1",
					"type": "integer",
					"value": 4,
					"metadatas": [
						{
							"name": "index",
							"value": 0
						},
						{
							"name": "min",
							"type": "integer",
							"value": 100
						},
						{
							"name": "max",
							"type": "integer",
							"value": 1300
						},
						{
							"name": "calibrate",
							"type": "string",
							"value": "return value - 58.3"
						}
					]
				}
			]
		}
	],
	"updateAction": "APPEND"
}
EOF
