#!/bin/sh

(curl context_broker:1026/v1/updateContext -s -S --header 'Content-Type: application/json' \
    --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
	"contextElements": [
		{
			"type": "PayloadMapping",
			"isPattern": "false",
			"id": "1",
			"attributes": [
				{
					"name": "attr1",
					"type": "integer",
					"value": 4,
					"metadatas": [
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
							"type": "function",
							"value": "function%28a%29%7Breturn%20a%2D58.3%7D"
						}
					]
				}
			]
		}
	],
	"updateAction": "APPEND"
}
EOF
